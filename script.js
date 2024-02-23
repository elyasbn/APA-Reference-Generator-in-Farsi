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
            reference = `${authorLastName}، ${authorFirstName}. (${year}). ${title}. ${additionalInfo}: ${publisher}.`;
            break;
        case 'journalArticle':
            const volumeIssue = document.querySelector('#journalArticleFields [name="volumeIssue"]')?.value;
            const yearPages = document.querySelector('#journalArticleFields [name="yearPages"]')?.value;
            reference = `${authorLastName}، ${authorFirstName}. (${year}). ${title}. ${additionalInfo}, ${volumeIssue}, ${yearPages}.`;
            break;
        case 'website':
            reference = `${authorLastName}، ${authorFirstName}. (${publishDate}). ${title}. ${additionalInfo}. Retrieved from ${url}`;
            break;
        case 'dissertation':
            reference = `${authorLastName}، ${authorFirstName}. (${year}). ${title}. (Doctoral dissertation). ${additionalInfo}.`;
            break;
        case 'conferencePaper':
            const dateLocation = document.querySelector('#conferencePaperFields [name="date"]')?.value + ', ' + additionalInfo;
            reference = `${authorLastName}، ${authorFirstName}. (${year}). ${title}. Paper presented at ${additionalInfo}, ${dateLocation}.`;
            break;
    }

    document.getElementById('referenceOutput').textContent = reference;
}

document.getElementById('generateButton').addEventListener('click', generateReference);

document.getElementById('copyButton').addEventListener('click', function() {
    const referenceText = document.getElementById('referenceOutput').textContent;
    if (!referenceText) {
        alert('هیچ مرجعی برای کپی وجود ندارد.');
        return;
    }

    // Copy referenceText to clipboard
    navigator.clipboard.writeText(referenceText).then(function() {
        alert('مرجع با موفقیت کپی شد.');
    }).catch(function(error) {
        alert('خطا هنگام کپی: ', error);
    });
});
