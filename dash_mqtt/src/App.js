import './App.css';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const {Account, Device, Services} = require('@tago-io/sdk'); 

let render = 0;
function App() {
   const account = new Account({token:"a394b4c9-7ea7-4346-bbe1-ddb35f9bc948"});
   const [arrayOfdevices,setArray] = useState([]);




    const notify = () => toast.success("Configuration performed!");
    const toastAlert = () => toast.error("Configuration already exists!");
    const AlertError = () => toast.error("There are more than 1 comands in the queue, it's not possible to add more commands.");
    const error = () => toast.error("There is a command in the file, it's not possible to add more commands before of execute that is in the file.") 
    

    async function listdevices(){
        let listResponse =  await account.devices.list();
        
        render++;
           render === 1 ? setArray(listResponse)
                                     : console.log()
       } 



        useEffect( () => {
            listdevices()
        } )
        
   

        window.TagoIO.onStart((widget) => {
            window.widget = widget;
        })
        window.TagoIO.ready();
 
       

        function insertParam(){
          let selectDevice = document.getElementById("devices");
          let device_token = selectDevice.options[selectDevice.selectedIndex].value;
    
          
          const get_configuration_parameters = async () => {
            const myDevice = new Device({ token: device_token });

            const result = await myDevice.getParameters();
            console.log(result)
          }

          get_configuration_parameters()
      }


  /* const myDataObject = "ID=1234567890ABCDEF,MODE=NULL,TIMER_GPRS=1,TIMER_GPS=1,TIMER_SMS=1,CMD=1";

  const options = {
    retain: false,
    qos: 2,
  };


  const MQTT = new Services({ token: "61f848bb-e3d0-4a13-836a-ef90d84834c3"}).MQTT;


  MQTT.publish({
    bucket: '63653142ae603e0011629b86', //device's bucket ? FROM CONTEXT OR SCOPE
    message: JSON.stringify(myDataObject), //the MQTT message
    topic: "869951032050266", //ESN or IMEI
    options,
  }).then((resp) => console.log(resp)) */




        return(
             <div className="container">
                <ToastContainer />
                    <div className="box">
                        
                        <div className ="cabecalho">
                            <div className ="title">Enviar Comando</div>
                        </div>
                        
                        
                        <div className ="fieldOfSelection">
                
                            <div className=" label_dev">
                                <img className ="drop" alt='' src="https://img.icons8.com/external-zen-filled-royyan-wijaya/2x/external-list-dropdown-business-zen-filled-royyan-wijaya.png" />
                                <div className ="title_label">Selecione os Dispositivos</div> 
                            </div>
                
                
                             <div className="input">
                                    <select id="devices" className ="devices">
                                    {arrayOfdevices.map((item) =>{
                                      let device_token = item.tags.find(dev => {return dev.key === "device_token"});
                                            return(
                                              <option value={device_token.value}>{item.name}</option>
                                            )
                                    })}
                                    </select>
                                </div> 
                                
                
                
                
                            <div className ="secondInput">
                
                                <div className =" label_dev">
                                    <img alt='' className ="drop" src="https://img.icons8.com/windows/2x/expand-arrow.png"/>
                                    <div className ="title_label">CMD</div> 
                                </div>
                
                                
                                <select id="configs" className ="inputCmd">
                                    <option value="Carga último perfil da plataforma">Carga último perfil da plataforma</option>
                                    <option value="Solicitar Identificação ID">Solicitar Identificação ID</option>
                                    <option value="Reiniciar Dispositivo">Reiniciar dispositivo</option>
                                    <option value="Ligar Modo Emergência">Ligar Modo Emergência</option>
                                    <option value="Ligar Modo Normal">Ligar Modo Normal</option>
                                    <option value="Solicita Posição LBS / GPS">Solicita Posição LBS / GPS</option>
                                    <option value="Status da Bateria">Status da Bateria</option>
                                    <option value="Alterar Frequência RF433">Alterar Frequência RF433</option>
                                    <option value="Alterar Melodia RF433">Alterar Melodia RF433</option>
                                </select>
                
                            </div>
                
                            
                
                            <div className="rodape">
                                 <button className="button" onClick={insertParam} >
                                    Enviar CMD
                                </button> 
                            </div>
                
                
                        </div>
                        
                    
                
                    </div>  
                    
                   
                </div>
           
        )
}

export default App;