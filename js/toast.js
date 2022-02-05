const navItems = $$('.nav__item')
const main = $('#toast')

function toastMessage ({
    title = '',
    message = '',
    type = ''
}) {
    toast = document.createElement('div')
    toast.classList.add('toast', `toast--${type}`);

    icons = {
        success: 'fas fa-check-circle',
        info: 'fas fa-info-circle',
        warn: 'fas fa-exclamation-circle',
        error: 'fas fa-exclamation-circle',
    }
    icon = icons[type];
    toast.innerHTML = `
        <i class="toast__icon ${icon}"></i>
        <div class="toast__body">
            <h3 class="toast__title">${title}</h3>
            <p class="toast__msg">${message}</p>
        </div>
        <i class="toast__close fas fa-times"></i>
    `
    main.appendChild(toast)

    toast.onclick = function(e) {

       if (e.target.closest('.toast__close')) {
            main.removeChild(toast)
       }
    }
}

function showSuccessMessage() {
    toastMessage({
        title: 'Successful',
        message: 'Congratulations!',
        type: 'success'
    }) 
}

function showInfoMessage() {
    toastMessage({
        title: 'Infomation',
        message: 'This funnction will be upgraded soon',
        type: 'info'
    })
}

function showWarningMessage() {
    toastMessage({
        title: 'Ooops...',
        message: 'This funnction will be upgraded soon',
        type: 'warn'
    })
}

function showErrorMessage() {
    toastMessage({
        title: 'Error',
        message: 'Please try again!',
        type: 'error'
    })
}

navItems.forEach(navItem => {
    navItem.onclick = function() {
        showWarningMessage()
    }
})