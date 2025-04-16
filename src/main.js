import { hide, show } from "./showhide.js"; // Import the functions
import { child, get, ref, set, runTransaction } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";
import { database } from './firebaseConfig.js';

let tableNum;

export function setPage(page) {
    hide('home')
    hide('overview')
    hide('pcs')
    hide('ppe')
    hide('sw')
    hide('gs')
    hide('mt')
    hide('clamps')
    hide('hms')
    hide('et')
    hide('st')
    hide('ct')

    show(page)
}

setPage('home');


function loadBoxPage() {
    tableNum = document.getElementById("tableNumber").value;
    setPage('overview');
}

async function openDrawer(drawer) {
    setPage(drawer);
    await loadItemStatus(drawer);
}

async function loadItemStatus(drawer) {
    const dbRef = ref(database);
    await get(child(dbRef, `tables/${tableNum}/${drawer}/`)).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const item = childSnapshot.key;
                const present = childSnapshot.val().present;
                const link = document.querySelector(`#${item}`);
                if (present !== "true" && !link.children[0].classList.contains('missing')) {
                    link.children[0].classList.toggle('missing');
                }
            });
        }

    }).catch((error) => {
        console.error(error);
    });
}

// async function goHome() {
//     if (confirm("If changes have been made please submit before returning to the front page")) {
//         setPage('home');
//     }
// }

export async function toggleItem(drawer, item) {
    console.log("item clicked")
    const link = document.querySelector(`#${item}`);
    if (link.children[0].classList.toggle('missing')) {
        await set(ref(database, `tables/${tableNum}/${drawer}/${item}/present`), 'false')
    } else {
        await set(ref(database, `tables/${tableNum}/${drawer}/${item}/present`), 'true')
    }
}

export async function logTools() {
    const dbRef = ref(database);
    const timestamp = new Date(Date.now());
    await get(child(dbRef, `tables/${tableNum}/`)).then((snap1) => {
        if (snap1.exists()) {
            snap1.forEach((childSnap1) => {
                const drawer = childSnap1.key
                get(child(dbRef, `tables/${tableNum}/${drawer}/`)).then((snap2) => {
                    if (snap2.exists()) {
                        snap2.forEach((childSnapshot) => {
                            const item = childSnapshot.key;
                            const present = childSnapshot.val().present;
                            if (present !== "true") {
                                set(ref(database, `tables/${tableNum}/${drawer}/${item}/missingLog/${timestamp}`), timestamp.toISOString());
                                runTransaction(ref(database, `tables/${tableNum}/${drawer}/${item}/missingOccurences`), (current) => {
                                    if (current === undefined) {
                                        current = 1;
                                    } else {
                                        current++;
                                    }
                                    return current;
                                });
                            } else {
                                set(ref(database, `tables/${tableNum}/${drawer}/${item}/presentLog/${timestamp}`), timestamp.toISOString());
                                runTransaction(ref(database, `tables/${tableNum}/${drawer}/${item}/presentOccurences`), (current) => {
                                    if (current === undefined) {
                                        current = 1;
                                    } else {
                                        current++;
                                    }
                                    return current;
                                });
                            }
                        });
                    }
                }).catch((error) => {
                    console.error(error);
                });
            })
        }
    }).catch((error) => {
        console.error(error);
    });;
    console.log("Statuses logged");
    setPage('home');
}

document.getElementById('loadBoxPage').onclick = loadBoxPage;
document.getElementById('logTools').onclick = logTools;
// document.getElementById('goHome').onclick = goHome;
window.onload = function () {
    const items = document.getElementsByClassName('tool');
    const drawers = document.getElementsByClassName('drawerButton');
    const backButtons = document.getElementsByClassName('backToBox');

    for (const back of backButtons) {
        back.addEventListener("click", e => {
            setPage('overview');
        })
    }
    for (const item of items) {
        item.addEventListener("click", e => {
            const item_data = document.querySelector(`#${item.id}`);
            toggleItem(item_data.dataset.drawer, item.id);
        })
    }
    for (const drawer of drawers) {
        const drawer_data = document.querySelector(`#${drawer.id}`);
        drawer.addEventListener("click", e => {
            openDrawer(drawer_data.dataset.drawer);
        })
    }
}