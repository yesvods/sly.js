import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.css';
import _ from 'lodash';

const {Component} = React;

const baseUrl = '';
class Main extends Component {
  constructor(){
    super();
    this.state = {
      mockData: []
    }
  }
  componentDidMount() {
    ::this.fetchData();
    let editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/json");
    this.setState({
      editor,
    });
    editor.getSession().setValue("function(){}")
  }
  fetchData(){
    fetch(`${baseUrl}/mock`)
      .then(income => income.json())
      .then(data => {
        this.setState({
          mockData: data
        });
      })
  }
  removeById(id){
    const _this = this;
    fetch(`${baseUrl}/mock/remove`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id})
    }).then(x => {
      _this.fetchData.call(_this);
    }).catch(err => {
      console.log('failure', err);
    })
  }
  add(obj){
    const _this = this;
    fetch(`${baseUrl}/mock/add`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(x => {
      _this.fetchData.call(_this);
    }).catch(err => {
      console.log('failure', err);
    })
  }
  render(){
    const {mockData, editor} = this.state;
    return (
<div className={style.container}>
  <table className="ui celled table">
    <thead>
      <tr><th>MockPath</th>
      <th>Data</th>
      <th>Operation</th>
    </tr></thead>
    <tbody>
  {mockData.map((data, index) => {
    return (
      <tr key={index}>
        <td>{data.jsonServerPathKey}</td>
        <td>{JSON.stringify(data.data, 2)}</td>
        <td>
          <button 
            className="ui red button"
            onClick={e => {
              console.log(data.id)
              this.removeById.call(this, data.id);
            }}
            >Remove
          </button>
        </td>
      </tr>
    )
  })}  
    </tbody>
  </table>
  <button 
    className="ui green button"
    onClick={e => {
      $(this.refs.modal)
        .modal('setting', {
          onApprove: () => {
            const path = this.refs.path.value;
            const mockData = editor.getSession().getValue();
            let data = JSON.parse(mockData);
            console.log(data)
            if(!_.isPlainObject(data)){
              alert('failure json format');
              return false;
            }
            data = {
              jsonServerPathKey: path,
              data,
            }
            this.add.call(this, data);
          }
        })
        .modal('show');
      editor.getSession().setValue("");
      // this.add.call(this, {
      //   "jsonServerPathKey": "/api/company/:name",
      //   "data": {
      //     "name": "${name}"
      //   }
      // })
    }}
    >Add
  </button>
<div className="ui modal fullscreen" ref="modal">
  <div className="content">
    <div className="description">
      <input 
        type="text" name="path" placeholder="Path"
        ref="path"/>
      <div id="editor"></div>
    </div>
  </div>
  <div className="actions">
    <div 
      className="ui positive right labeled icon button">
      Add
      <i className="checkmark icon"></i>
    </div>
  </div>
</div>
</div>
    )
  }
}
ReactDOM.render(<Main></Main>, document.getElementById('mount'));