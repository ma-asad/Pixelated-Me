window.onload = function () {
  loadLeaderboard();
};

function loadLeaderboard() {
  let users = getUsersFromLocalStorage();
  users = sortUsersByRank(users);
  displayUsersOnLeaderboard(users);
}

function getUsersFromLocalStorage() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function sortUsersByRank(users) {
  return users.sort((a, b) => a.timeTaken - b.timeTaken);
}

function displayUsersOnLeaderboard(users) {
  let tableBody = document.querySelector(".leaderboard-table tbody");
  tableBody.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    let row = createTableRow(user, i);
    tableBody.appendChild(row);
  }
}

function createTableRow(user, index) {
  let row = document.createElement("tr");
  if (index === 0) {
    row.classList.add("first-row");
  }

  let rankCell = createCell(index + 1);
  let usernameCell = createCell(user.username);
  let timeCell = createCell(user.timeTaken);

  row.appendChild(rankCell);
  row.appendChild(usernameCell);
  row.appendChild(timeCell);

  return row;
}

function createCell(text) {
  let cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function updateLeaderboard(user) {
  let users = getUsersFromLocalStorage();
  let index = findUserIndex(users, user);

  if (index !== -1) {
    users[index].timeTaken = user.timeTaken;
  } else {
    users.push(user);
  }

  saveUsersToLocalStorage(users);
  loadLeaderboard();
}

function findUserIndex(users, user) {
  return users.findIndex((u) => u.username === user.username);
}

function saveUsersToLocalStorage(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
