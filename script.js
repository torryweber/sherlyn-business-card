/* =========================================
   SHERLYN CHONG
   DIGITAL NFC BUSINESS CARD
   PHASE 1
========================================= */


/* =========================================
   CARD URL
========================================= */

const CARD_URL =
    "https://torryweber.github.io/sherlyn-business-card/";


/* =========================================
   SHARE IMAGE
========================================= */

const SHARE_IMAGE =
    "share-contact.png";


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
   BUTTONS
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
   SAVE CONTACT
========================================= */

if (saveContactButton) {

    saveContactButton.addEventListener(
        "click",
        saveContact
    );

}


function saveContact() {

    const vcard = [

        "BEGIN:VCARD",

        "VERSION:3.0",

        `N:${contact.lastName};${contact.firstName};;;`,

        `FN:${contact.fullName}`,

        `ORG:${contact.company}`,

        `TITLE:${contact.jobTitle}`,

        `TEL;TYPE=CELL,VOICE:${contact.phone}`,

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


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================
   SHARE CONTACT
========================================= */

if (shareButton) {

    shareButton.addEventListener(
        "click",
        shareContact
    );

}


/* =========================================
   SHARE CONTACT
========================================= */

async function shareContact() {

    try {

        /*
         * Load the REAL pre-created
         * contact image.
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
                "Share image not found."
            );

        }


        const blob =
            await response.blob();


        /*
         * Create shareable file
         */

        const imageFile =
            new File(
                [blob],
                "Sherlyn-Chong-Contact.png",
                {
                    type:
                        "image/png"
                }
            );


        /*
         * Share text
         */

        const shareText =
            "Sherlyn Chong\n" +
            "Key Account Executive\n" +
            "Saint-Gobain Weber & Tekbond";


        /*
         * iPhone / Android:
         * Share IMAGE + URL
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
                    "Sherlyn Chong",

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
         * Browser can share URL
         * but not files.
         */

        if (
            navigator.share
        ) {

            await navigator.share({

                title:
                    "Sherlyn Chong",

                text:
                    shareText +
                    "\n\n" +
                    CARD_URL,

                url:
                    CARD_URL

            });

            return;

        }


        /*
         * Desktop / unsupported:
         * download picture + copy URL.
         */

        downloadImage(
            blob
        );


        await copyURL();

    }

    catch (error) {

        console.error(
            "Share error:",
            error
        );


        /*
         * If share was cancelled,
         * don't show an error.
         */

        if (
            error &&
            error.name ===
            "AbortError"
        ) {

            return;

        }


        /*
         * Fallback.
         */

        fallbackShare();

    }

}


/* =========================================
   DOWNLOAD SHARE IMAGE
========================================= */

function downloadImage(
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
        "Sherlyn-Chong-Contact.png";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================
   COPY URL
========================================= */

async function copyURL() {

    try {

        await navigator
            .clipboard
            .writeText(
                CARD_URL
            );


        showToast(
            "Card link copied"
        );

    }

    catch (error) {

        fallbackCopy(
            CARD_URL
        );

    }

}


/* =========================================
   FALLBACK COPY
========================================= */

function fallbackCopy(
    text
) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        showToast(
            "Card link copied"
        );

    }

    catch (error) {

        alert(
            text
        );

    }


    document.body.removeChild(
        textarea
    );

}


/* =========================================
   FALLBACK SHARE
========================================= */

async function fallbackShare() {

    try {

        await navigator
            .clipboard
            .writeText(
                CARD_URL
            );


        showToast(
            "Card link copied"
        );

    }

    catch (error) {

        alert(
            CARD_URL
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
                "30px",

            transform:
                "translateX(-50%)",

            zIndex:
                "9999",

            padding:
                "12px 18px",

            borderRadius:
                "14px",

            background:
                "rgba(15,25,50,.94)",

            color:
                "#ffffff",

            fontSize:
                "13px",

            fontWeight:
                "600",

            border:
                "1px solid rgba(255,255,255,.12)",

            boxShadow:
                "0 10px 30px rgba(0,0,0,.30)",

            backdropFilter:
                "blur(20px)",

            WebkitBackdropFilter:
                "blur(20px)"

        }
    );


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        2200
    );

}