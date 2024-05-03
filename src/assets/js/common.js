$(document).ready(function() {
    // SIDE BAR
    $(document).on('click', '.menubar', function(e) {
        $(".sidemenu").toggleClass("hide");
        $("body").toggleClass("sm-overflow-hidden");
        $(".sidemenu  a span").toggleClass("menu-title");
        $(".content").toggleClass("hide");
        if ($(".sidemenu").hasClass("hide")) {
            $(".mobile-sidebar-backdrop").addClass("backdrop-opened");
        } else {
            $(".mobile-sidebar-backdrop").removeClass("backdrop-opened");
        }
    });
    // DROPDOWN WITH SUBMENU
    // $(document).on('click', '.dropdown-submenu a.submenu-a', function(e) {
    $('.dropdown-submenu a.submenu-a').on("click", function(e) {
        console.log("event triggerd");
        $("ul").find('.show-submenu').removeClass('show-submenu');
        $(this).next('ul').toggleClass("show-submenu");
        e.stopPropagation();
        e.preventDefault();
    });
    $(document).on('click', 'body', function(e) {
        // $('body').on("click", function() {
        $("ul").find('.show-submenu').removeClass('show-submenu');
    });

    // SINGLE AND BULK RADIO OPTION
    $(document).on('click', '.file-upload-radio[type="radio"]', function(e) {
        var uploadval = $(this).val();
        $("div.file-upload").hide();
        $("#show-" + uploadval).show();
    })

    $('.graduated').on('change', function() {
        if (this.value == 'yes') {
            $(".grad").show();
            $(".prof").hide();
        }
        if (this.value == 'no') {
            $(".grad").hide();
            $(".prof").show();
        }
        if (this.value == 'none') {
            $(".grad").hide();
            $(".prof").hide();
        }
    });

    // for dorp zone
    $(document).on('change', '.file-input', function() {
        var filesCount = $(this)[0].files.length;
        var textbox = $(this).prev();
        if (filesCount === 1) {
            var fileName = $(this).val().split('\\').pop();
            textbox.text(fileName);
        } else {
            textbox.text(filesCount + ' files selected');
        }
    });
    document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
        const dropZoneElement = inputElement.closest(".drop-zone");
        dropZoneElement.addEventListener("click", (e) => {
            inputElement.click();
        });
        inputElement.addEventListener("change", (e) => {
            if (inputElement.files.length) {
                updateThumbnail(dropZoneElement, inputElement.files[0]);
            }
        });
        dropZoneElement.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZoneElement.classList.add("drop-zone--over");
        });
        ["dragleave", "dragend"].forEach((type) => {
            dropZoneElement.addEventListener(type, (e) => {
                dropZoneElement.classList.remove("drop-zone--over");
            });
        });
        dropZoneElement.addEventListener("drop", (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
                inputElement.files = e.dataTransfer.files;
                updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
            }
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    /**
     * Updates the thumbnail on a drop zone element.
     *
     * @param {HTMLElement} dropZoneElement
     * @param {File} file
     */
    function updateThumbnail(dropZoneElement, file) {
        let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
        // First time - remove the prompt
        if (dropZoneElement.querySelector(".drop-zone__prompt")) {
            dropZoneElement.querySelector(".drop-zone__prompt").remove();
        }
        // First time - there is no thumbnail element, so lets create it
        if (!thumbnailElement) {
            thumbnailElement = document.createElement("div");
            thumbnailElement.classList.add("drop-zone__thumb");
            dropZoneElement.appendChild(thumbnailElement);
        }
        thumbnailElement.dataset.label = file.name;
        // Show thumbnail for image files
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
            };
        } else {
            thumbnailElement.style.backgroundImage = null;
        }
    }

});

$("#forgot").click(function() {
    $(".forgot-section").show();
    $(".login-section").hide();
    $(".password-section").hide();
});
$("#backLogin").click(function() {
    $(".forgot-section").hide();
    $(".login-section").show();
    $(".password-section").hide();
});
$("#forgotSubmit").click(function() {
    $(".forgot-section").hide();
    $(".login-section").hide();
    $(".password-section").show();
});
$("#passwordSubmit").click(function() {
    $(".forgot-section").hide();
    $(".login-section").show();
    $(".password-section").hide();
});


$('#eye').click(function() {

    if ($(this).hasClass('la-eye-slash')) {

        $(this).removeClass('la-eye-slash');

        $(this).addClass('la-eye');

        $('#password').attr('type', 'text');

    } else {

        $(this).removeClass('la-eye');

        $(this).addClass('la-eye-slash');

        $('#password').attr('type', 'password');
    }
});