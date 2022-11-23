import './App.css';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const {Account, Device, Services} = require('@tago-io/sdk'); 

    
    const notify = (message) => toast.success(message);
    const error = (message) => toast.error(message) 
    


let render = 0;
function App() {
   const account = new Account({token:"191363cf-b92e-4700-8d9f-ca21d9e9783b"});
   const [arrayOfdevices,setArray] = useState([]);
   let parameters_values = new Array();
    

    async function listdevices(){
        let filter = {
            tags:[
                  {
                    key:"TYPE",
                    value:"MQTT"
                  },
                 ]
         }
        let listResponse =  await account.devices.list({filter});
        
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




        const get_configuration_parameters = async (device_token) => {
            try{
                 const myDevice = new Device({ token: device_token });
                 parameters_values = [];

                 const result = await myDevice.getParameters();
                 result.forEach((parameter) => parameters_values.push({
                      key:parameter.key,
                      value:parameter.value
                   })
                 );//in this code line, i'm catching all the values of device's configuration parameter and i'm storing in an array. 
   
             }catch(err){
               error(`${err}, please verify the device's tag. Something can be wrong`);
               console.log(err)
             }

           };




           const send_mqtt_to_device = async (device_name) => {
              try{

                    let formated_string = `ID=${(Math.floor(Math.random() * 1000000000)).toString(16)},MODE=${ (parameters_values.find((parameter) => {return parameter.key === 'mode'})).value  },TIMER_GPRS=${ (parameters_values.find((parameter) => {return parameter.key === 'TIMER_GPRS'})).value  },TIMER_GPS=${ (parameters_values.find((parameter) => {return parameter.key === 'TIMER_GPS'})).value  },TIMER_SMS=${ (parameters_values.find((parameter) => {return parameter.key === 'TIMER_SMS'})).value  },CMD=${ (parameters_values.find((parameter) => {return parameter.key === 'CMD'})).value  }`;
                    const options = { retain: false, qos: 2 };
                    
                    
                    const MQTT = new Services({ token: "61f848bb-e3d0-4a13-836a-ef90d84834c3"}).MQTT;//this toke it's a token of an external analysis. It will be static
                    MQTT.publish({
                        bucket: (arrayOfdevices.find((dev) => dev.name === device_name)).id , //device's bucket ? FROM CONTEXT OR SCOPE
                        message: JSON.stringify(formated_string), //the MQTT message
                        topic: (arrayOfdevices.find((dev) => dev.name === device_name)).tags.find(tag => { return tag.key === "ESN"}).value, //ESN or IMEI
                        options,
                    })
                      .then((resp) => notify(resp))   
                      .catch((err) => {error(err); console.log(err)}) 

              }catch(err){
                error("Something went wrong. Please, verify if the tags of your device are right.");
                console.log(err)
              }
                
           }

           
       

        async function send_message(){
            let selectDevice = document.getElementById("devices");
            let device_id = selectDevice.options[selectDevice.selectedIndex].value.split(',')[0];
            let device_name = selectDevice.options[selectDevice.selectedIndex].value.split(",")[1];   
            

            const get_device_token = async() => {
              try{

                let paralist = await account.devices.paramList(device_id);
                let search_device_token = paralist.find(item => item.key === 'device_token');
                return search_device_token.value;

              }catch(err){
                  error(err);
                  console.log(err)
              }
               
            };
            
         
            await get_configuration_parameters(await get_device_token());
            await send_mqtt_to_device(device_name);
 
      }


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
                                <div className ="title_label">Select the device to configure it</div> 
                            </div>
                
                
                              <div className="input">
                                    <select id="devices" className ="devices">
                                    {arrayOfdevices.map((item) =>{
                                        try{
                                            return(
                                                <option value={`${item.id},${item.name}`}> {item.name} </option>
                                            )
                                        }catch(err){
                                           error(err)
                                        }
                                      
                                    })}
                                    </select>
                                </div>  
                                
                
                            
                
                            <div className="rodape">
                                 <button className="button" onClick={send_message} >
                                    Sent MQTT Message
                                </button> 
                            </div>
                
                
                        </div>
                        
                    
                
                    </div>  
                    
                   
                </div>
           
        )
}

export default App;