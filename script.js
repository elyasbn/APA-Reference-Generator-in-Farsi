function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.classList.remove('hidden'); // Show the notification

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    const copyInTextReferenceBtn = document.getElementById('copyInTextReference');
    const copyFinalReferenceBtn = document.getElementById('copyFinalReference');

    copyInTextReferenceBtn.addEventListener('click', function() {
        const inTextReference = document.getElementById('inTextReferenceOutput').textContent;
        if (inTextReference) {
            navigator.clipboard.writeText(inTextReference).then(() => {
                showCopyNotification();
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        }
    });

    copyFinalReferenceBtn.addEventListener('click', function() {
        const finalReference = document.getElementById('finalReferenceOutput').textContent;
        if (finalReference) {
            navigator.clipboard.writeText(finalReference).then(() => {
                showCopyNotification();
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        }
    });
});

document.getElementById('documentType').addEventListener('change', function() {
    // Hide all fields initially
    document.querySelectorAll('div[id$="Fields"]').forEach(function(section) {
        section.classList.add('hidden');
    });

    // Show the selected document type fields
    const selectedSection = document.getElementById(`${this.value}Fields`);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }
});

function generateReference() {
    const type = document.getElementById('documentType').value;
    let reference = '';

    const authorFirstName = document.querySelector(`#${type}Fields [name="authorFirstName"]`)?.value;
    const authorLastName = document.querySelector(`#${type}Fields [name="authorLastName"]`)?.value;
    const title = document.querySelector(`#${type}Fields [name="title"]`)?.value || document.querySelector(`#${type}Fields [name="articleTitle"]`)?.value || document.querySelector(`#${type}Fields [name="thesisTitle"]`)?.value || document.querySelector(`#${type}Fields [name="paperTitle"]`)?.value;
    const year = document.querySelector(`#${type}Fields [name="year"]`)?.value;
    const additionalInfo = document.querySelector(`#${type}Fields [name="location"]`)?.value || document.querySelector(`#${type}Fields [name="journalName"]`)?.value || document.querySelector(`#${type}Fields [name="websiteName"]`)?.value || document.querySelector(`#${type}Fields [name="university"]`)?.value || document.querySelector(`#${type}Fields [name="conferenceName"]`)?.value;
    const url = document.querySelector(`#${type}Fields [name="url"]`)?.value;
    const publishDate = document.querySelector(`#${type}Fields [name="publishDate"]`)?.value;    

    switch (type) {
        case 'book':
            const publisher = document.querySelector('#bookFields [name="publisher"]')?.value;
            reference = `${authorLastName}، ${authorFirstName} (${year}). ${title}. ${additionalInfo}: ${publisher}.`;
            break;
        case 'journalArticle':
            const volumeIssue = document.querySelector('#journalArticleFields [name="volumeIssue"]')?.value;
            const pages = document.querySelector('#journalArticleFields [name="pages"]')?.value;
            reference = `${authorLastName}، ${authorFirstName} (${year}). ${title}. ${additionalInfo}، ${volumeIssue}، ${pages}.`;
            break;
        case 'website':
            const pageTitle = document.querySelector('#websiteFields [name="pageTitle"]')?.value;
            reference = `${authorLastName}، ${authorFirstName} (${publishDate}). ${pageTitle}. ${additionalInfo}. بازیابی‌شده از:  ${url}`;
            break;
        case 'dissertation':
            const dissertationType = document.getElementById('dissertationType').value;
            let typeText = dissertationType === 'masterThesis' ? 'پایان‌نامه کارشناسی ارشد' : 'رساله دکتری';
            reference = `${authorLastName}، ${authorFirstName}. (${year}). ${title}. ${typeText}. ${additionalInfo}.`;
            break;
        case 'conferencePaper':
            const dateLocation = document.querySelector('#conferencePaperFields [name="date"]')?.value + ', ' + additionalInfo;
            reference = `${authorLastName}، ${authorFirstName}. (${year}). ${title}. Paper presented at ${additionalInfo}, ${dateLocation}.`;
            break;
    }

    let inTextReference = `(${authorLastName}، ${year})`;

    document.getElementById('finalReferenceOutput').textContent = reference;
    document.getElementById('inTextReferenceOutput').textContent = inTextReference;
    document.getElementById('referenceOutput').classList.remove('hidden');
}

document.getElementById('generateButton').addEventListener('click', generateReference);
