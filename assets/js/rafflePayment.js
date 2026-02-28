import{a as d,r as l,f as c,i as p,T as i,H as n,b as a}from"./index2.js";class u extends d{static properties={};static styles=[p`${l(c)}`];constructor(){super(),this.step=null,this.loading=!1,this.steps=[{id:1,name:"Identificate",description:"Ingresa tu correo electrónico y el ID de tu orden para validar tu pago.",active:!0,block:!1},{id:2,name:"Sube tu comprobante",description:"Adjunta una imagen o PDF que demuestre tu pago.",active:!1,block:!1},{id:3,name:"Resultado",description:"Estado de validacion",active:!1,block:!1}],this.form={},this.errorCaptured=null,this.orders=[]}setActiveStep(e){this.steps=this.steps.map(t=>(t.active=t.id===e,t)),this.requestUpdate()}setBlockStep(e){this.steps=this.steps.map(t=>(t.id===e&&(t.block=!0),t)),this.requestUpdate()}hadleCompleteValidation(){const e=this.shadowRoot.getElementById("payment-validation-form"),r=new FormData(e).get("email");if(this.form.email=r,!r){i({text:"Por favor ingresa un correo electrónico válido.",duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast();return}try{this.loading=!0,n.getOrdersByEmail(r).then(o=>{if(o.length===0)throw new Error("No se encontraron órdenes para este correo.");this.orders=o,this.setBlockStep(1),this.setActiveStep(2),this.loading=!1}).catch(o=>{i({text:o.message,duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast()}).finally(()=>{this.loading=!1})}catch(o){i({text:o.message,duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast()}}async handleSendProof(){const e=this.shadowRoot.getElementById("payment-validation-form"),t=new FormData(e),o=e.querySelector('input[name="payment_proof"]').files[0];if(!o){i({text:"Por favor adjunta un comprobante de pago.",duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast();return}t.append("email",this.form.email),t.append("payment_proof",o),t.append("step",2),t.append("order_id",this.orders[0].id);try{this.loading=!0;const s=await n.sendPaymentProof(t);if(s.success)i({text:"Comprobante enviado exitosamente. Estamos validando tu pago.",duration:3e3,gravity:"top",position:"center",backgroundColor:"#48bb78"}).showToast(),this.setActiveStep(3);else throw new Error(s.data||"Error al enviar el comprobante.")}catch(s){i({text:s.message,duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast()}finally{this.loading=!1}}handleRenderOrders(){return a`
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${this.orders.map(e=>a`
                <div class="border p-4 rounded-md">
                    <h3 class="text-lg font-semibold mb-2">Orden #${e.id}</h3>
                    <p><strong>Correo:</strong> ${e.customer_email}</p>
                    <p><strong>Rifa:</strong> ${e.raffle_id}</p>
                    <p><strong>Fecha:</strong> ${new Date(e.created_at).toLocaleDateString()}</p>
                </div>
            `)}
        </div>`}handleBackStep(e){this.setActiveStep(e),this.orders=[]}render(){return a`
        <div>
            <nav class="w-full bg-gray-800 text-white p-4 rounded-t-md mb-6">
                <div class="flex flex-col gap-2">
                    <h1 class="text-4xl text-center font-bold">Validación de Pago</h1>
                    <ul class="flex items-center justify-center space-x-10 mt-6">
                        ${this.steps.map(e=>a`
                            <li
                                class="border text-white hover:bg-red-900 rounded-full flex items-center justify-center w-12 h-12 ${e.active?"bg-red-900 pointer-events-none":e.block?"bg-red-900 cursor-not-allowed":"bg-red-500 cursor-pointer"}"
                                @click=${()=>e.active||e.block?null:this.setActiveStep(e.id)}
                                disabled=${e.block?"disabled":null}
                            >
                                ${e.id}
                            </li>
                        `)}
                    </ul>
                </div>
            </nav>
            <form id="payment-validation-form" class="w-full">
                ${this.loading?a`
                    <div class="w-full h-64 flex items-center justify-center"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div></div>
                `:a`
                <div>
                    ${this.steps.map(e=>a`
                    <div class="w-full mb-4 p-4 ${e.active?"block":"hidden"}">
                        <h2 class="text-2xl text-center font-semibold mb-2">${e.name}</h2>
                        <p class="text-gray-200 text-center">${e.description}</p>
                    </div>
                    
                    <div class="p-2 max-w-4xl mx-auto flex flex-col items-center justify-center">
                        ${e.id===1&&e.active?a`
                            <input type="email" name="email" placeholder="Correo electrónico" class="w-full mb-4 p-2 border border-white rounded-sm" required>
                            <button type="button" @click=${()=>this.hadleCompleteValidation()} class="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Completar validación</button>`:""}
                        
                        ${e.id===2&&e.active?a`
                            ${this.handleRenderOrders()}
                            <input type="file" name="payment_proof" accept="image/*,application/pdf" class="w-full mb-4 p-2" required>
                            <div class="flex justify-center gap-4 items-center">
                                <button type="button" @click=${()=>this.handleBackStep(1)} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Atras</button>
                                <button type="button" @click=${()=>this.handleSendProof()} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Enviar comprobante</button>
                            </div>`:""}
                        
                        ${e.id===3&&e.active?a`
                            <p class="text-gray-700">Validación completada exitosamente.</p>
                            <p class="text-gray-700">Una vez validado tu pago, enviaremos un correo notificando la orden.</p>
                        `:""}
                    </div>
                `)}
                </div>`}
                
                <div class="w-full">
                </div>
            </form>
        </div>
        `}}customElements.define("raffle-payment-validation",u);
