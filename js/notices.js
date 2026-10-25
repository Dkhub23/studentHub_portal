(function () {
    const STORAGE_KEY = "studentHubNotices";

    function readNotices() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function formatDate(value) {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
    }

    function renderNoticeList(container, canEdit, limit) {
        const notices = readNotices().sort((a, b) => new Date(b.updatedAt || b.publishedAt) - new Date(a.updatedAt || a.publishedAt));
        container.replaceChildren();
        const visible = typeof limit === "number" ? notices.slice(0, limit) : notices;
        if (!visible.length) {
            const empty = document.createElement("p");
            empty.className = "profile-empty";
            empty.textContent = "There are no notices published yet.";
            container.appendChild(empty);
            return;
        }
        visible.forEach(function (notice) {
            const card = document.createElement("article");
            card.className = "card";
            card.style.margin = "12px 0";
            const heading = document.createElement("h3");
            heading.textContent = notice.title;
            const body = document.createElement("p");
            body.style.whiteSpace = "pre-wrap";
            body.textContent = notice.body;
            const meta = document.createElement("small");
            meta.className = "muted";
            meta.textContent = "Published by " + (notice.author || "Staff") + " · " + formatDate(notice.publishedAt);
            if (notice.updatedAt && notice.updatedAt !== notice.publishedAt) {
                meta.textContent += " · Updated " + formatDate(notice.updatedAt) + " by " + (notice.updatedBy || notice.author || "Staff");
            }
            card.append(heading, body, meta);
            if (canEdit) {
                const edit = document.createElement("button");
                edit.type = "button";
                edit.className = "btn-secondary";
                edit.textContent = "Edit notice";
                edit.style.marginLeft = "12px";
                edit.addEventListener("click", function () {
                    const form = document.getElementById("noticeForm");
                    form.dataset.editingId = notice.id;
                    document.getElementById("noticeTitle").value = notice.title;
                    document.getElementById("noticeBody").value = notice.body;
                    document.getElementById("noticeEditorTitle").textContent = "Edit notice";
                    document.getElementById("noticeSubmit").textContent = "Save changes";
                    document.getElementById("noticeCancelEdit").hidden = false;
                    document.getElementById("noticeEditor").scrollIntoView({ behavior: "smooth", block: "start" });
                });
                card.appendChild(edit);
            }
            container.appendChild(card);
        });
    }

    window.renderStudentNotices = function (targetId, limit) {
        const target = document.getElementById(targetId);
        if (target) renderNoticeList(target, false, limit);
    };

    document.addEventListener("DOMContentLoaded", function () {
        const user = window.AuthGuard ? AuthGuard.getCurrentUser() : null;
        const role = user && user.role ? user.role.toLowerCase() : null;
        const editor = document.getElementById("noticeEditor");
        const list = document.getElementById("noticeList");
        const studentDashboardList = document.getElementById("studentNoticeList");
        if (list) renderNoticeList(list, role === "faculty" || role === "admin");
        if (studentDashboardList) renderNoticeList(studentDashboardList, false, 5);
        if (!editor) return;

        const staffCanEdit = role === "faculty" || role === "admin";
        editor.hidden = !staffCanEdit;
        const description = document.getElementById("noticePageDescription");
        if (role === "student" && description) description.textContent = "Published notices are available here for students to read.";
        if (!staffCanEdit) return;

        const form = document.getElementById("noticeForm");
        const status = document.getElementById("noticeFormStatus");
        const cancel = document.getElementById("noticeCancelEdit");
        function resetEditor() {
            form.reset();
            delete form.dataset.editingId;
            document.getElementById("noticeEditorTitle").textContent = "Add a notice";
            document.getElementById("noticeSubmit").textContent = "Publish notice";
            cancel.hidden = true;
            status.textContent = "";
        }
        cancel.addEventListener("click", resetEditor);
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const title = document.getElementById("noticeTitle").value.trim();
            const body = document.getElementById("noticeBody").value.trim();
            if (!title || !body) return;
            const notices = readNotices();
            const now = new Date().toISOString();
            const editingId = form.dataset.editingId;
            let action;
            if (editingId) {
                const notice = notices.find(item => item.id === editingId);
                if (!notice) { resetEditor(); return; }
                notice.title = title;
                notice.body = body;
                notice.updatedAt = now;
                notice.updatedBy = user.displayName || user.username || "Staff";
                action = "notice_updated";
            } else {
                notices.push({
                    id: String(Date.now()) + Math.random().toString(16).slice(2),
                    title: title,
                    body: body,
                    author: user.displayName || user.username || "Staff",
                    authorRole: role,
                    publishedAt: now,
                    updatedAt: now
                });
                action = "notice_published";
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
            if (window.AuthGuard) AuthGuard.logActivity(action, "notice.html");
            resetEditor();
            renderNoticeList(list, true);
            status.textContent = "Notice saved and published to the student dashboard.";
        });
    });
})();
