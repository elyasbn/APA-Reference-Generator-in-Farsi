function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.classList.remove('hidden'); 

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    displaySavedCitations();
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

    document.getElementById('documentType').addEventListener('change', function() {
        document.querySelectorAll('div[id$="Fields"]').forEach(function(section) {
            section.classList.add('hidden');
        });

        const selectedSection = document.getElementById(`${this.value}Fields`);
        if (selectedSection) {
            selectedSection.classList.remove('hidden');
        }

        const authorsSection = document.getElementById('authorFields');
        if (this.value === 'book' || this.value === 'journalArticle' || this.value === 'conferencePaper') {
            authorsSection.classList.remove('hidden');
        } else {
            authorsSection.classList.add('hidden');
        }
    });

    document.getElementById('addAuthorBtn').addEventListener('click', function() {
        const authorInputsContainer = document.getElementById('authorInputs');
        const newAuthorInput = document.createElement('div');
        newAuthorInput.classList.add('author-input');
        newAuthorInput.innerHTML = `
            <input type="text" name="authorFirstName[]" class="mb-2 p-2 border rounded block" placeholder="نام">
            <input type="text" name="authorLastName[]" class="mb-4 p-2 border rounded block" placeholder="نام خانوادگی">
        `;
        authorInputsContainer.appendChild(newAuthorInput);
    });

    document.getElementById('generateButton').addEventListener('click', generateReference);
});

function generateReference() {
    const type = document.getElementById('documentType').value;
    let reference = '';

    const authorInputs = document.querySelectorAll(`#${type}Fields [name^="authorFirstName[]"]`);
    let authors = [];
    authorInputs.forEach(inputGroup => {
        const firstName = inputGroup.value.trim();
        const lastName = inputGroup.nextElementSibling.value.trim();
        if (firstName !== '' && lastName !== '') {
            authors.push(`${lastName}، ${firstName}`);
        }
    });
    const authorString = authors.join('; ');

    const title = document.querySelector(`#${type}Fields [name="title"]`)?.value || document.querySelector(`#${type}Fields [name="articleTitle"]`)?.value || document.querySelector(`#${type}Fields [name="thesisTitle"]`)?.value || document.querySelector(`#${type}Fields [name="paperTitle"]`)?.value;
    const year = document.querySelector(`#${type}Fields [name="year"]`)?.value;
    const additionalInfo = document.querySelector(`#${type}Fields [name="location"]`)?.value || document.querySelector(`#${type}Fields [name="journalName"]`)?.value || document.querySelector(`#${type}Fields [name="websiteName"]`)?.value || document.querySelector(`#${type}Fields [name="university"]`)?.value || document.querySelector(`#${type}Fields [name="conferenceName"]`)?.value;
    const url = document.querySelector(`#${type}Fields [name="url"]`)?.value;
    const publishDate = document.querySelector(`#${type}Fields [name="publishDate"]`)?.value;

    switch (type) {
        case 'book':
            const publisher = document.querySelector('#bookFields [name="publisher"]')?.value;
            reference = `${authorString} (${year}). ${title}. ${additionalInfo}: ${publisher}.`;
            break;
            case 'journalArticle':
                const volume = document.querySelector('#journalArticleFields [name="volume"]')?.value;
                const issue = document.querySelector('#journalArticleFields [name="issue"]')?.value;
                const startPage = document.querySelector('#journalArticleFields [name="startPage"]')?.value;
                const endPage = document.querySelector('#journalArticleFields [name="endPage"]')?.value;
                let pageRange = '';
                if (startPage && endPage) {
                    pageRange = `${startPage}-${endPage}`;
                } else if (startPage) {
                    pageRange = startPage;
                } else if (endPage) {
                    pageRange = endPage;
                }
                reference = `${authorString} (${year}). ${title}. ${additionalInfo}، ${volume}(${issue})، ${pageRange}.`;
                break;
        case 'website':
            const pageTitle = document.querySelector('#websiteFields [name="pageTitle"]')?.value;
            reference = `${authorString} (${publishDate}). ${pageTitle}. ${additionalInfo}. بازیابی‌شده از:  ${url}`;
            break;
        case 'dissertation':
            const dissertationType = document.getElementById('dissertationType').value;
            let typeText = dissertationType === 'masterThesis' ? 'پایان‌نامه کارشناسی ارشد' : 'رساله دکتری';
            reference = `${authorString}. (${year}). ${title}. ${typeText}. ${additionalInfo}.`;
            break;
        case 'conferencePaper':
            const dateLocation = document.querySelector('#conferencePaperFields [name="date"]')?.value + '، ' + additionalInfo;
            reference = `${authorString}. (${year}). ${title}. ارائه‌شده در: ${additionalInfo}، ${dateLocation}.`;
            break;
    }

    let inTextReference = '';

    const authorLastName = authors.map(item => item.split('،')[0]);

    if (authors.length === 1) {
        inTextReference = `(${authorLastName[0]}، ${year})`;
    } else if (authors.length === 2) {
        inTextReference = `(${authorLastName[0]} و ${authorLastName[1]}، ${year})`;
    } else if (authors.length > 2) {
        inTextReference = `(${authorLastName[0]} و همکاران، ${year})`;
        console.log(authors);
    }

    saveCitationToLocalStorage(reference);

    document.getElementById('finalReferenceOutput').textContent = reference;
    document.getElementById('inTextReferenceOutput').textContent = inTextReference;
    document.getElementById('referenceOutput').classList.remove('hidden');

    displaySavedCitations();
}

function saveCitationToLocalStorage(citation) {
    let savedCitations = JSON.parse(localStorage.getItem('savedCitations')) || [];
    savedCitations.push(citation);
    localStorage.setItem('savedCitations', JSON.stringify(savedCitations));
}

function displaySavedCitations() {
    let savedCitations = JSON.parse(localStorage.getItem('savedCitations')) || [];
    
    savedCitations.sort();

    const tableBody = document.getElementById('savedCitationsTableBody');
    tableBody.innerHTML = '';
    savedCitations.forEach((citation, index) => {
        const row = `
            <tr>
                <td class="border border-gray-200 px-4 py-2">${citation}</td>
                <td class="border border-gray-200 px-4 py-2">
                    <button onclick="copyCitation(${index})" class="px-2 mt-3 py-1 bg-blue-500 text-white rounded w-full">کپی</button>
                    <button onclick="deleteCitation(${index})" class="px-2 mt-3 py-1 bg-red-500 text-white rounded w-full">حذف</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function copyCitation(index) {
    const savedCitations = JSON.parse(localStorage.getItem('savedCitations')) || [];
    const citation = savedCitations[index];
    if (citation) {
        navigator.clipboard.writeText(citation).then(() => {
            alert('کپی شد!');
        }).catch(err => {
            console.error('خطا در هنگام کپی: ', err);
        });
    }
}

function deleteCitation(index) {
    let savedCitations = JSON.parse(localStorage.getItem('savedCitations')) || [];
    savedCitations.splice(index, 1);
    localStorage.setItem('savedCitations', JSON.stringify(savedCitations));
    displaySavedCitations();
}

