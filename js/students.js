// ==========================================
// STUDENTS MODULE
// ==========================================

let studentsData = [];
let filteredStudents = [];

let studentCurrentPage = 1;

const studentRecordsPerPage = 6;


// ==========================================
// FETCH STUDENTS
// ==========================================

async function loadStudents() {

    const loading =
        document.getElementById(
            "studentsLoading"
        );

    const error =
        document.getElementById(
            "studentsError"
        );


    try {

        loading.style.display = "block";

        error.textContent = "";


        const response =
            await fetch(
                "data/students.json"
            );


        if (!response.ok) {
            throw new Error(
                "Unable to fetch students.json"
            );
        }


        studentsData =
            await response.json();


        filteredStudents =
            [...studentsData];


        loading.style.display = "none";


        renderStudents();


    } catch (err) {

        loading.style.display = "none";


        error.textContent =
            "❌ Error loading student data.";


        console.error(err);

    }
}


// ==========================================
// RENDER STUDENTS
// ==========================================

function renderStudents() {

    const container =
        document.getElementById(
            "studentsContainer"
        );


    container.innerHTML = "";


    const start =
        (studentCurrentPage - 1) *
        studentRecordsPerPage;


    const end =
        start + studentRecordsPerPage;


    const records =
        filteredStudents.slice(
            start,
            end
        );


    if (records.length === 0) {

        container.innerHTML =
            "<p>No students found.</p>";

        document.getElementById(
            "studentsPagination"
        ).innerHTML = "";

        return;
    }


    records.forEach(student => {

        const card =
            document.createElement("div");


        card.className =
            "card student-data-card";


        card.innerHTML = `
            <h3>👨‍🎓 ${student.name}</h3>

            <p>
                <strong>ID:</strong>
                ${student.id}
            </p>

            <p>
                <strong>Branch:</strong>
                ${student.branch}
            </p>

            <p>
                <strong>Year:</strong>
                ${student.year}
            </p>

            <p>
                <strong>Email:</strong>
                ${student.email}
            </p>
        `;


        container.appendChild(card);

    });


    renderStudentPagination();
}


// ==========================================
// SEARCH + FILTER
// ==========================================

function filterStudents() {

    const search =
        document
            .getElementById(
                "studentSearch"
            )
            .value
            .toLowerCase();


    const branch =
        document.getElementById(
            "studentBranch"
        ).value;


    const year =
        document.getElementById(
            "studentYear"
        ).value;


    filteredStudents =
        studentsData.filter(student => {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(search) ||

                student.branch
                    .toLowerCase()
                    .includes(search) ||

                student.email
                    .toLowerCase()
                    .includes(search);


            const matchesBranch =
                branch === "all" ||
                student.branch === branch;


            const matchesYear =
                year === "all" ||
                String(student.year) === year;


            return (
                matchesSearch &&
                matchesBranch &&
                matchesYear
            );

        });


    studentCurrentPage = 1;

    renderStudents();
}


// ==========================================
// SORT STUDENTS
// ==========================================

function sortStudents() {

    const sort =
        document.getElementById(
            "studentSort"
        ).value;


    if (sort === "nameAsc") {

        filteredStudents.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    } else if (sort === "nameDesc") {

        filteredStudents.sort(
            (a, b) =>
                b.name.localeCompare(
                    a.name
                )
        );

    } else if (sort === "yearAsc") {

        filteredStudents.sort(
            (a, b) =>
                a.year - b.year
        );

    } else if (sort === "yearDesc") {

        filteredStudents.sort(
            (a, b) =>
                b.year - a.year
        );

    }


    studentCurrentPage = 1;

    renderStudents();
}


// ==========================================
// PAGINATION
// ==========================================

function renderStudentPagination() {

    const pagination =
        document.getElementById(
            "studentsPagination"
        );


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            filteredStudents.length /
            studentRecordsPerPage
        );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent = page;


        if (
            page ===
            studentCurrentPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.addEventListener(
            "click",
            function () {

                studentCurrentPage =
                    page;

                renderStudents();

            }
        );


        pagination.appendChild(
            button
        );

    }
}


// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const search =
            document.getElementById(
                "studentSearch"
            );

        const branch =
            document.getElementById(
                "studentBranch"
            );

        const year =
            document.getElementById(
                "studentYear"
            );

        const sort =
            document.getElementById(
                "studentSort"
            );


        if (search) {
            search.addEventListener(
                "input",
                filterStudents
            );
        }


        if (branch) {
            branch.addEventListener(
                "change",
                filterStudents
            );
        }


        if (year) {
            year.addEventListener(
                "change",
                filterStudents
            );
        }


        if (sort) {
            sort.addEventListener(
                "change",
                sortStudents
            );
        }


        loadStudents();

    }
);