
const EventEmitter2 = require('eventemitter2').EventEmitter2;

class socketMock extends EventEmitter2 {

  constructor(){
    super();

    this.id="hgffgugghgjghhgjgfu";
  }

  emmitirMensagem(evt, data){
    let msg = new Mensagem(); //@todo
    this.emit(evt, msg);
  }

}

module.exports = socketMock;