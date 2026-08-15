/* =========================================
   SHERLYN CHONG
   DIGITAL NFC BUSINESS CARD
   PRODUCTION JAVASCRIPT
========================================= */


/* =========================================
   CARD URL
========================================= */

const CARD_URL =
    "https://torryweber.github.io/sherlyn-business-card/";


/* =========================================
   SHARE PREVIEW IMAGE
========================================= */

const SHARE_IMAGE =
    "share-preview.png";


/* =========================================
   CONTACT INFORMATION
========================================= */

const contact = {

    firstName:
        "Sherlyn",

    lastName:
        "Chong",

    fullName:
        "Sherlyn Chong",

    jobTitle:
        "Key Account Executive",

    company:
        "Saint-Gobain Weber & Tekbond",

    phone:
        "+60 12-281 5972",

    whatsapp:
        "60122815972",

    email:
        "Sherlyn.CHONG@saint-gobain.com",

    website:
        "https://www.saint-gobain.my",

    factory:
        "https://maps.app.goo.gl/sUvoEyH1seHjzpY28?g_st=ic"

};


/* =========================================
   DOM
========================================= */

const saveContactButton =
    document.getElementById(
        "saveContact"
    );

const shareButton =
    document.getElementById(
        "shareCard"
    );


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeCard
);


function initializeCard() {

    document.body.classList.add(
        "card-ready"
    );


    setupSaveContact();

    setupShare();

    registerServiceWorker();

    setupExternalLinks();

    preventDoubleTapZoom();

}


/* =========================================
   SAVE CONTACT
========================================= */

function setupSaveContact() {

    if (!saveContactButton) {

        return;

    }


    saveContactButton.addEventListener(
        "click",
        saveContact
    );

}


function saveContact() {

    if (
        saveContactButton.dataset.busy ===
        "true"
    ) {

        return;

    }


    saveContactButton.dataset.busy =
        "true";


    const vcard = [

        "BEGIN:VCARD",

        "VERSION:3.0",

        `N:${escapeVCF(contact.lastName)};${escapeVCF(contact.firstName)};;;`,

        `FN:${escapeVCF(contact.fullName)}`,

        `ORG:${escapeVCF(contact.company)}`,

        `TITLE:${escapeVCF(contact.jobTitle)}`,

        `TEL;TYPE=CELL,VOICE:${contact.phone}`,

        `TEL;TYPE=WORK,VOICE:${contact.phone}`,

        `EMAIL;TYPE=WORK:${contact.email}`,

        `URL:${contact.website}`,

        "END:VCARD"

    ].join("\r\n");


    const blob =
        new Blob(
            [vcard],
            {
                type:
                    "text/vcard;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        "Sherlyn-Chong.vcf";

    link.style.display =
        "none";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1500
    );


    showToast(
        "Contact ready to save"
    );


    setTimeout(
        () => {

            saveContactButton.dataset.busy =
                "false";

        },
        1200
    );

}


/* =========================================
   VCF ESCAPE
========================================= */

function escapeVCF(value) {

    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /;/g,
            "\\;"
        )

        .replace(
            /,/g,
            "\\,"
        )

        .replace(
            /\n/g,
            "\\n"
        );

}


/* =========================================
   SHARE CONTACT
========================================= */

function setupShare() {

    if (!shareButton) {

        return;

    }


    shareButton.addEventListener(
        "click",
        shareContact
    );

}


async function shareContact() {

    if (
        shareButton.dataset.busy ===
        "true"
    ) {

        return;

    }


    shareButton.dataset.busy =
        "true";


    try {

        /*
         * Load the single
         * share-preview.png.
         */

        const response =
            await fetch(
                SHARE_IMAGE,
                {
                    cache:
                        "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Share preview image unavailable."
            );

        }


        const blob =
            await response.blob();


        /*
         * Convert image to File.
         */

        const imageFile =
            new File(
                [blob],
                "Sherlyn-Chong-Share.png",
                {
                    type:
                        "image/png"
                }
            );


        /*
         * Text shown with sharing.
         */

        const shareText =
            `${contact.fullName}\n` +
            `${contact.jobTitle}\n` +
            `${contact.company}`;


        /*
         * iPhone / Android:
         * Share image + URL.
         */

        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files:
                    [imageFile]
            })
        ) {

            await navigator.share({

                title:
                    contact.fullName,

                text:
                    shareText,

                url:
                    CARD_URL,

                files:
                    [imageFile]

            });


            return;

        }


        /*
         * URL sharing fallback.
         */

        if (
            navigator.share
        ) {

            await navigator.share({

                title:
                    contact.fullName,

                text:
                    `${shareText}\n\n${CARD_URL}`,

                url:
                    CARD_URL

            });


            return;

        }


        /*
         * Desktop fallback.
         */

        downloadShareImage(
            blob
        );


        await copyText(
            CARD_URL
        );


        showToast(
            "Card preview downloaded"
        );

    }

    catch (error) {

        /*
         * User cancelled.
         */

        if (
            error &&
            error.name ===
            "AbortError"
        ) {

            return;

        }


        console.error(
            "Share error:",
            error
        );


        /*
         * Final fallback:
         * copy card URL.
         */

        try {

            await copyText(
                CARD_URL
            );


            showToast(
                "Card link copied"
            );

        }

        catch {

            alert(
                CARD_URL
            );

        }

    }

    finally {

        setTimeout(
            () => {

                shareButton.dataset.busy =
                    "false";

            },
            800
        );

    }

}


/* =========================================
   DOWNLOAD PREVIEW
========================================= */

function downloadShareImage(
    blob
) {

    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        "Sherlyn-Chong-Share.png";


    link.style.display =
        "none";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1500
    );

}


/* =========================================
   COPY
========================================= */

async function copyText(
    text
) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        await navigator
            .clipboard
            .writeText(
                text
            );

        return;

    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;

    textarea.setAttribute(
        "readonly",
        ""
    );

    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-9999px";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    const successful =
        document.execCommand(
            "copy"
        );


    textarea.remove();


    if (!successful) {

        throw new Error(
            "Copy failed."
        );

    }

}


/* =========================================
   TOAST
========================================= */

function showToast(
    message
) {

    const oldToast =
        document.querySelector(
            ".toast-message"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast-message";


    toast.textContent =
        message;


    Object.assign(
        toast.style,
        {

            position:
                "fixed",

            left:
                "50%",

            bottom:
                "calc(25px + env(safe-area-inset-bottom))",

            transform:
                "translateX(-50%)",

            zIndex:
                "99999",

            padding:
                "12px 18px",

            borderRadius:
                "14px",

            background:
                "rgba(10,22,48,.94)",

            color:
                "#ffffff",

            fontSize:
                "13px",

            fontWeight:
                "600",

            whiteSpace:
                "nowrap",

            border:
                "1px solid rgba(255,255,255,.12)",

            boxShadow:
                "0 12px 35px rgba(0,0,0,.30)",

            backdropFilter:
                "blur(20px)",

            WebkitBackdropFilter:
                "blur(20px)",

            opacity:
                "0",

            transition:
                "opacity .2s ease"

        }

    );


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.style.opacity =
                "1";

        }
    );


    setTimeout(
        () => {

            toast.style.opacity =
                "0";


            setTimeout(
                () => {

                    toast.remove();

                },
                250
            );

        },
        2000
    );

}


/* =========================================
   EXTERNAL LINKS
========================================= */

function setupExternalLinks() {

    const links =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    link.style.transform =
                        "scale(.98)";


                    setTimeout(
                        () => {

                            link.style.transform =
                                "";

                        },
                        150
                    );

                }
            );

        }
    );

}


/* =========================================
   SERVICE WORKER
========================================= */

function registerServiceWorker() {

    if (
        !("serviceWorker" in navigator)
    ) {

        return;

    }


    window.addEventListener(
        "load",
        async () => {

            try {

                const registration =
                    await navigator
                        .serviceWorker
                        .register(
                            "./sw.js"
                        );


                console.log(
                    "Sherlyn Card PWA ready:",
                    registration.scope
                );


                registration.update();

            }

            catch (error) {

                console.error(
                    "PWA registration failed:",
                    error
                );

            }

        }
    );

}


/* =========================================
   PREVENT DOUBLE TAP ZOOM
========================================= */

function preventDoubleTapZoom() {

    let lastTouchEnd =
        0;


    document.addEventListener(
        "touchend",
        event => {

            const now =
                Date.now();


            if (
                now -
                lastTouchEnd <=
                280
            ) {

                event.preventDefault();

            }


            lastTouchEnd =
                now;

        },
        {
            passive:
                false
        }
    );

}


/* =========================================
   VISIBILITY
========================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            document.body.classList.add(
                "card-active"
            );

        }

    }
);