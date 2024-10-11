const login = document.querySelector("#login");
const nimi = document.querySelector("#name");
const otsikko = document.querySelector("h1");
const todoform = document.querySelector("#todoform");
const input = document.querySelector("#todoinput");
const todolist = document.querySelector("#todolist");

function validoiKentat() {
    event.preventDefault()

    let tunnus = nimi.value;
    if (tunnus != "") {
        localStorage.setItem("nimi", tunnus);  
        avaaSivu();
    } else {
        alert("Kenttää ei voi lähettää tyhjänä.");
    }
}

function raivaa() {
    nimi.placeholder = "";
}

function palauta() {
    nimi.placeholder = "Syötä nimesi";
}

function tyhjennä() {
    input.placeholder = "";
}

function lisää () {
    input.placeholder = "Mitä haluaisit lisätä?";
}

function avaaSivu() {
    let tunnus = nimi.value;
    login.style.display = "none";
    otsikko.textContent = "Tervetuloa " +tunnus +". Tässä voit ylläpitää omaa listaasi.";
    todoform.style.display = "flex";
    lataaLista();
}

function lomake() {
    event.preventDefault()
    const teksti = input.value;

    if (teksti == "") {
        alert("Kenttä ei voi olla tyhjä.");
        return;
    }

    lisääTehtävä(teksti);
    tallennaLista();
    input.value = "";
}

function lisääTehtävä(teksti){
    const li = document.createElement("li");
        
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            li.classList.add("done");
        } else {
            li.classList.remove("done");
        }
        tallennaLista()
    });

    const Span = document.createElement("span");
    Span.textContent = teksti;

    const poistanappi = document.createElement("button");
    poistanappi.textContent = "Poista";
    poistanappi.classList.add("poistonappi");
    poistanappi.addEventListener("click", function() {
        li.remove();
        tallennaLista();
        näytäNapit();
    });

    li.appendChild(checkbox);
    li.appendChild(Span);
    li.appendChild(poistanappi);

    todolist.appendChild(li);
    tallennaLista();
    näytäNapit();
}

function tallennaLista() {
    const tasks = [];
    todolist.querySelectorAll("li").forEach(function(li) {
        const Teksti = li.querySelector("span").textContent;
        const tehty = li.querySelector("input").checked;
        tasks.push({ text: Teksti, done: tehty });
    });
    localStorage.setItem("todolist", JSON.stringify(tasks));
}

function lataaLista() {
    const savedTasks = JSON.parse(localStorage.getItem("todolist"));
    if (savedTasks) {
        savedTasks.forEach(function(task) {
            lisääTehtävä(task.text);
            const li = todolist.lastChild;
            li.querySelector('input').checked = task.done;
            if (task.done) {
                li.classList.add('done');
            }
        });
    }
    näytäNapit()
}

function tyhjennäLista() {
    todolist.innerHTML = "";
    localStorage.removeItem("todolist");
    näytäNapit()
}

function näytäKaikki() {
    const kaikki = todolist.querySelectorAll("li");
    kaikki.forEach(task => {
        task.style.display = "";
    });
}

function näytäTehdyt() {
    const kaikki = todolist.querySelectorAll("li");
    kaikki.forEach(task => {
        if (task.classList.contains("done")) {
            task.style.display = "";
        } else {
            task.style.display = "none";
        }
    });
}

function näytäTekemättömät() {
    const kaikki = todolist.querySelectorAll("li");
    kaikki.forEach(task => {
        if (task.classList.contains("done")) {
            task.style.display = "none";
        } else {
            task.style.display = "";
        }
    });
}

function näytäNapit() {
    const buttonsContainer = document.querySelector("#napit");
    const taskCount = todolist.children.length;

    if (taskCount >= 2) {
        buttonsContainer.style.display = "flex";
    } else {
        buttonsContainer.style.display = "none";
    }
}

window.onload = function() {
    const savedName = localStorage.getItem("nimi");
    if (savedName) {
        const continueWithSavedName = confirm(`Hei taas, ${savedName}! Haluatko avata olemassa olevan listasi?`);
        
        if (continueWithSavedName) {
            nimi.value = savedName;
            avaaSivu();
        } else {
            localStorage.removeItem("nimi");
            localStorage.removeItem("todolist");
            nimi.value = "";
        }
    }
}

