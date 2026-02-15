const schools = {
  "SPM-001": {
    password: "putrajaya2026",
    schoolName: "SMK Putrajaya Precinct 18",
    students: [
      "Aina Syakirah",
      "Daniel Ng",
      "Faris Hakim",
      "Hana Sofea",
      "Irfan Zikri",
      "Jia Lee",
      "Kavitha Nair",
      "Luqman Azri",
      "Nabila Adriana",
      "Wan Yusuf"
    ]
  },
  "SPM-002": {
    password: "johorbahru!24",
    schoolName: "SMK Sultan Ismail, Johor Bahru",
    students: [
      "Aisyah Nadia",
      "Balqis Huda",
      "Chong Wei Jian",
      "Darren Lee",
      "Ellysa Imani",
      "Fatin Nur",
      "Ganesha Kumar",
      "Haziq Arman",
      "Iskandar Putra",
      "Jocelyn Tan"
    ]
  },
  "SPM-003": {
    password: "sarawak#spm",
    schoolName: "SMK Kuching High, Sarawak",
    students: [
      "Adrian Low",
      "Bryan Chia",
      "Camelia Rose",
      "Dayang Nur",
      "Ethan Lim",
      "Fahmi Ridzuan",
      "Grace Neo",
      "Hariz Qayyum",
      "Izzati Raihan",
      "Jasper Ting"
    ]
  }
};

const loginCard = document.getElementById("loginCard");
const dashboardCard = document.getElementById("dashboardCard");
const schoolCodeInput = document.getElementById("schoolCode");
const schoolPasswordInput = document.getElementById("schoolPassword");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardSchoolName = document.getElementById("dashboardSchoolName");
const dashboardSchoolCode = document.getElementById("dashboardSchoolCode");
const studentRows = document.getElementById("studentRows");
const attendanceForm = document.getElementById("attendanceForm");
const attendanceMessage = document.getElementById("attendanceMessage");
const attendanceSummary = document.getElementById("attendanceSummary");

let activeSchoolCode = null;

function setMessage(target, text, type) {
  target.textContent = text;
  target.classList.remove("error", "success");
  if (type) target.classList.add(type);
}

function renderStudentRows(students) {
  studentRows.innerHTML = "";

  students.forEach((studentName, index) => {
    const row = document.createElement("div");
    row.className = "student-row";

    const number = document.createElement("span");
    number.className = "student-index";
    number.textContent = `${index + 1}.`;

    const name = document.createElement("span");
    name.className = "student-name";
    name.textContent = studentName;

    const toggleLabel = document.createElement("label");
    toggleLabel.className = "attend-toggle";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = `student-${index}`;
    checkbox.value = studentName;

    const labelText = document.createElement("span");
    labelText.textContent = "Present";

    toggleLabel.appendChild(checkbox);
    toggleLabel.appendChild(labelText);

    row.appendChild(number);
    row.appendChild(name);
    row.appendChild(toggleLabel);

    studentRows.appendChild(row);
  });
}

function openDashboard(schoolCode, schoolData) {
  activeSchoolCode = schoolCode;
  loginCard.classList.add("hidden");
  dashboardCard.classList.remove("hidden");
  dashboardSchoolName.textContent = schoolData.schoolName;
  dashboardSchoolCode.textContent = `School Code: ${schoolCode}`;
  renderStudentRows(schoolData.students);
  setMessage(attendanceMessage, "", "");
  attendanceSummary.classList.add("hidden");
  attendanceSummary.innerHTML = "";
}

function logout() {
  activeSchoolCode = null;
  schoolPasswordInput.value = "";
  loginCard.classList.remove("hidden");
  dashboardCard.classList.add("hidden");
  setMessage(loginMessage, "Logged out.", "success");
}

loginBtn.addEventListener("click", () => {
  const schoolCode = schoolCodeInput.value.trim().toUpperCase();
  const password = schoolPasswordInput.value;

  const schoolData = schools[schoolCode];

  if (!schoolData) {
    setMessage(loginMessage, "Invalid school code.", "error");
    return;
  }

  if (schoolData.password !== password) {
    setMessage(loginMessage, "Incorrect password.", "error");
    return;
  }

  setMessage(loginMessage, "", "");
  openDashboard(schoolCode, schoolData);
});

attendanceForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!activeSchoolCode) {
    setMessage(attendanceMessage, "Session expired. Please log in again.", "error");
    return;
  }

  const schoolData = schools[activeSchoolCode];
  const attendance = [];

  schoolData.students.forEach((studentName, index) => {
    const checkbox = attendanceForm.elements.namedItem(`student-${index}`);
    const present = checkbox ? checkbox.checked : false;
    attendance.push({ name: studentName, present });
  });

  const presentStudents = attendance.filter((item) => item.present);
  const absentStudents = attendance.filter((item) => !item.present);

  attendanceSummary.innerHTML = `
    <h4>Attendance Saved Successfully</h4>
    <p><strong>Total Present:</strong> ${presentStudents.length} / ${attendance.length}</p>
    <p><strong>Total Absent:</strong> ${absentStudents.length}</p>
    <p><strong>Saved:</strong> ${new Date().toLocaleString()}</p>
    <ul>
      ${attendance
        .map(
          (item, index) =>
            `<li>${index + 1}. ${item.name} — <strong>${item.present ? "Present" : "Absent"}</strong></li>`
        )
        .join("")}
    </ul>
  `;

  attendanceSummary.classList.remove("hidden");
  setMessage(attendanceMessage, "Attendance record updated.", "success");
});

logoutBtn.addEventListener("click", logout);
