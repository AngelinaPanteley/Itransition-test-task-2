const Mustache = require('mustache');

class Database {
  constructor(filepath) {
    this.filepath=filepath;
    this.loadPage=this.loadPage.bind(this);
    this.loadFile=this.loadFile.bind(this);
    this.getFile=this.getFile.bind(this);
    this.generateForm=this.generateForm.bind(this);
    this.generateTable=this.generateTable.bind(this);
    this.submitForm=this.submitForm.bind(this);
    this.changeForm=this.changeForm.bind(this);
    this.selectAll=this.selectAll.bind(this);
    this.clearSelection=this.clearSelection.bind(this);
    this.sortColumn=this.sortColumn.bind(this);
  }

  loadPage(step) {
    const page = document.getElementById(step).text;
    Mustache.parse(page);
    const rendered = Mustache.render(page);
    document.getElementById('content').innerHTML = rendered;
  }

  getFile() {
    const path = this.filepath;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', path, true);
      xhr.onload = function () {
        if(this.status===200) {
          resolve(this.response);
        } else {
          reject(new Error(this.status));
        }
      }
      xhr.send();
    });
  }

  loadFile() {
    this.loadPage('step1');
    this.getFile().then(
      response => {
        this.response=JSON.parse(response);
        this.loadPage('step2');
        this.generateForm();
      },
      error => {
        alert(error);
      }
    );
  }

  generateForm() {
    this.keys = Object.keys(this.response[0]);
    const selectors = document.getElementById('selectors');
    const template = '<li class="form__checkbox"><input class="form__checkbox__input" id={{key}} type="checkbox" name="column"  /><label class="form__checkbox__label" for={{key}}>{{key}}</label></li>';
    this.keys.forEach((key) => {
      selectors.innerHTML+=Mustache.to_html(template, {key: key});
    });
    document.getElementById('submit-btn').addEventListener('click', this.submitForm);
    document.getElementById('select-all').addEventListener('click', this.selectAll);
    document.getElementById('clear-selection').addEventListener('click', this.clearSelection);
  }

  submitForm(e) {
    e.preventDefault();
    const checkedInputs = document.querySelectorAll('li.form__checkbox input:checked');
    this.checkedValues=[];
    if(checkedInputs.length) {
      checkedInputs.forEach((input) => {
        this.checkedValues.push(input.id);
      })
      this.loadPage('step3');
      this.generateTable();
      document.getElementById('back-btn').addEventListener('click', this.changeForm);
    } else {
      alert('Please, choose some fields');
    }
  }

  generateTable() {
    const templateHead = '<td class="data-table__{{key}}" id={{key}}>{{value}}<a class="sort up"></a><a class="sort down"></a></td>';
    const template = '<td class="data-table__{{key}}">{{value}}</td>';
    const head = document.getElementById('table-head');
    head.innerHTML='';
    this.checkedValues.forEach((value) => {
      head.innerHTML+=Mustache.to_html(templateHead, {value: value, key: value});
    });
    const body = document.getElementById('table-body');
    body.innerHTML='';
    this.response.forEach((responseItem) => {
      const row = document.createElement('tr');
      this.checkedValues.forEach((key) => {
        row.innerHTML+=Mustache.to_html(template, {value: responseItem[key], key: key});
      });
      body.appendChild(row);
    })
    document.querySelectorAll('.sort').forEach((elem) => {
      elem.addEventListener('click', this.sortColumn);
    });
  }

  changeForm() {
    this.loadPage('step2');
    this.generateForm();
    this.checkedValues.forEach((value) => {
      document.querySelector(`input#${value}`).checked = true;
    });
  }

  selectAll() {
    document.querySelectorAll('li.form__checkbox input').forEach(input => {
      input.checked=true;
    });
  }

  clearSelection() {
    document.querySelectorAll('li.form__checkbox input:checked').forEach(input => {
      input.checked=false;
    });
  }

  sortColumn(e) {
    const key = e.target.parentNode.id;

    function compareUp(elem1, elem2) {
      if(!Number.isNaN(+elem1[key])) {
        return elem2[key] - elem1[key];
      } else {
        return elem1[key]>elem2[key]? -1 : (elem1[key]<elem2[key]? 1 : 0);
      }
    }

    function compareDown(elem1, elem2) {
      if(!Number.isNaN(+elem1[key])) {
        return elem1[key] - elem2[key];
      } else {
        return elem1[key]<elem2[key]? -1 : (elem1[key]>elem2[key]? 1 : 0);
      }
    }

    if(e.target.classList.contains('up')) {
      this.response.sort(compareUp);
    } else {
      this.response.sort(compareDown);
    }
    this.generateTable();
  }
}

module.exports = Database;