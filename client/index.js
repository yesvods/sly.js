import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.css';
import _ from 'lodash';

import 'script!./static/jquery.js';
import 'script!./static/ace.js';
import 'script!./static/semantic.min.js';

import 'script!./static/mode-json';
import 'script!./static/theme-monokai';


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
  /**
   * 查看数据详情
   */
  checkData(e,data){
    const $modal = $(this.refs.showdetail);
    $modal.find('.ui.header').text(window.location.origin + data.jsonServerPathKey);
    $modal.find('.context pre').text(JSON.stringify(data.data, null, 4));
    $modal.modal('show');
  }
  /**
   * 显示编辑界面
   */
  showUpdate(e, data){
    const $modal = $(this.refs.modal);
    const {editor} = this.state;
    editor.setValue(JSON.stringify(data.data,null,2));
    $modal.find('[name="path"]').val(data.jsonServerPathKey).attr('disabled','true');
    $modal.find('.ui.button').text('提交修改');
    $modal
      .modal('setting',{
        onApprove: () => {
          const path = this.refs.path.value;
          const mockData = editor.getSession().getValue();
          let data = JSON.parse(mockData);
          console.log(data)

          if(!_.isPlainObject(data) && !_.isArray(data)){
            alert('failure json format');
            return false;
          }

          data = {
            jsonServerPathKey: path,
            data,
          }

          this.saveData.call(this, data);
        }
      })
      .modal('show');
  }
  /**
   * 保存数据
   */
  saveData(data){
    const _this = this;
    fetch(`${baseUrl}/mock/update`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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
  <table className="ui table">
    <thead>
      <tr ><th>访问地址</th>
      <th >数据</th>
      <th >操作</th>
    </tr></thead>
    <tbody>
  {mockData.map((data, index) => {
    return (
      <tr key={index}>
        <td><span style={{color: '#CECECE'}}>{window.location.origin}</span>{data.jsonServerPathKey}</td>
        <td
          style={{
            wordBreak: "break-all",
          }}><button className="ui button" onClick={e=>this.checkData(e, data)}>查看详情</button></td>
        <td>
          <button className="ui blue button" onClick={e => this.showUpdate(e, data)}>编辑</button>
          <button 
            className="ui red button"
            onClick={e => {
              console.log(data.id)
              this.removeById.call(this, data.id);
            }}
            >删除
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
            if(!_.isPlainObject(data) && !_.isArray(data)){
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
        $(this.refs.modal).find('.ui.button').text('确定添加');
      editor.getSession().setValue("");
      // this.add.call(this, {
      //   "jsonServerPathKey": "/api/company/:name",
      //   "data": {
      //     "name": "${name}"
      //   }
      // })
    }}
    >新增
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
    <div className="ui positive right button">
      确定添加
    </div>
  </div>
</div>
<div className="ui modal" ref="showdetail">
  <div className="content">
    <h3 className="ui header"></h3>
    <div className="context">
      <pre></pre>
    </div>
  </div>
  <div className="actions">
    <div 
      className="ui positive right blue button">
      关闭
    </div>
  </div>
</div>
</div>
    )
  }
}
ReactDOM.render(<Main></Main>, document.getElementById('mount'));