// ===== Seleção dos elementos =====
const btnMenu = document.querySelector(".btnMenu");
const menu = document.querySelector("#menuPrincipal");
const linksMenu = document.querySelectorAll(".menu a");
const btnMatricula = document.querySelector(".btnMatricula");
const formMatricula = document.querySelector(".formMatricula");
const campoNome = document.querySelector("#name");
const campoEmail = document.querySelector("#email");
const erroNome = document.querySelector("#erroName");
const erroEmail = document.querySelector("#erroEmail");
const mensagemForm = document.querySelector("#mensagemForm");

// Respeita quem desativou animações no sistema
const semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const comportamentoRolagem = semAnimacao ? "auto" : "smooth";

// ===== Menu hambúrguer (celular) =====
function alternarMenu(abrir) {
    menu.classList.toggle("aberto", abrir);
    btnMenu.setAttribute("aria-expanded", String(abrir));
    btnMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
}

btnMenu.addEventListener("click", () => {
    const estaAberto = menu.classList.contains("aberto");
    alternarMenu(!estaAberto);
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        alternarMenu(false);
    }
});

// ===== Rolagem suave até a seção =====
function irParaSecao(id) {
    const destino = document.querySelector(id);
    if (destino) {
        destino.scrollIntoView({ behavior: comportamentoRolagem });
    }
}

linksMenu.forEach((link) => {
    link.addEventListener("click", (evento) => {
        evento.preventDefault();
        irParaSecao(link.getAttribute("href"));
        alternarMenu(false);
    });
});

btnMatricula.addEventListener("click", () => {
    irParaSecao("#matricula");
    alternarMenu(false);
    campoNome.focus({ preventScroll: true });
});

// ===== Destaca no menu a seção que está na tela =====
const secoesMonitoradas = document.querySelectorAll("#inicio, #sobre, #matricula");

const observador = new IntersectionObserver(
    (entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                linksMenu.forEach((link) => {
                    const ehDestaSecao = link.getAttribute("href") === `#${entrada.target.id}`;
                    link.classList.toggle("ativo", ehDestaSecao);
                });
            }
        });
    },
    { rootMargin: "-40% 0px -50% 0px" }
);

secoesMonitoradas.forEach((secao) => observador.observe(secao));

// ===== Validação do formulário =====
function nomeValido(valor) {
    // pelo menos duas palavras (nome e sobrenome) com 2+ letras cada
    const partes = valor.trim().split(/\s+/);
    return partes.length >= 2 && partes.every((parte) => parte.length >= 2);
}

function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

function mostrarErro(campo, elementoErro, texto) {
    campo.classList.add("invalido");
    campo.setAttribute("aria-invalid", "true");
    elementoErro.textContent = texto;
}

function limparErro(campo, elementoErro) {
    campo.classList.remove("invalido");
    campo.removeAttribute("aria-invalid");
    elementoErro.textContent = "";
}

// limpa o erro assim que a pessoa volta a digitar
campoNome.addEventListener("input", () => limparErro(campoNome, erroNome));
campoEmail.addEventListener("input", () => limparErro(campoEmail, erroEmail));

formMatricula.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mensagemForm.textContent = "";

    const nome = campoNome.value;
    const email = campoEmail.value;
    let formularioOk = true;

    if (!nomeValido(nome)) {
        mostrarErro(campoNome, erroNome, "Digite seu nome completo (nome e sobrenome).");
        formularioOk = false;
    }

    if (!emailValido(email)) {
        mostrarErro(campoEmail, erroEmail, "Digite um e-mail válido, como nome@email.com.");
        formularioOk = false;
    }

    if (!formularioOk) {
        // leva o foco para o primeiro campo com problema
        formMatricula.querySelector(".invalido").focus();
        return;
    }

    const primeiroNome = nome.trim().split(/\s+/)[0];
    // textContent (e não innerHTML) evita injetar HTML digitado no campo
    mensagemForm.textContent = `Inscrição confirmada, ${primeiroNome}! Enviaremos os próximos passos para ${email.trim()}.`;
    formMatricula.reset();
});
