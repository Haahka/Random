// ==UserScript==
// @name        MatikkaTallennus
// @namespace   Matikkaeditori
// @match       https://math-demo.abitti.fi/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      Haahka
// @description Tallentaa muutokset matikkaeditorissa
// @run-at      document-load
// ==/UserScript==

// Tuo tallennetut arvot ainoastaan refreshin jälkeen
const onlyLoadAfterRefresh = true;
const editorId = '#answer1';

const pageAccessedByReload = (
  (window.performance.navigation && window.performance.navigation.type === 1) ||
    window.performance
      .getEntriesByType('navigation')
      .map((nav) => nav.type)
      .includes('reload')
);

function saveChanges() {
    const editorValue = document.querySelector(editorId).innerHTML;
  
    if(typeof editorValue == 'string') {
        GM_setValue('save', editorValue);
    }
}

function loadChanges() {
    let savedEditorValue = GM_getValue('save');
  
    if(!pageAccessedByReload && onlyLoadAfterRefresh) {
        savedEditorValue = '';
        GM_setValue('save', '');
    }
  
    if(typeof savedEditorValue == 'string') {
        document.querySelector(editorId).innerHTML = savedEditorValue;
    }
}

loadChanges();

const observer = new MutationObserver(saveChanges);

observer.observe(document.querySelector(editorId), {
    attributes: true, characterData: true, subtree: true
});
