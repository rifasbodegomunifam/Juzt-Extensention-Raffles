import{a as c,i as s,r as l,f as p,T as r,H as d,b as o}from"./index2.js";const f=".toastify{padding:12px 20px;color:#fff;display:inline-block;box-shadow:0 3px 6px -1px #0000001f,0 10px 36px -4px #4d60e84d;background:-webkit-linear-gradient(315deg,#73a5ff,#5477f5);background:linear-gradient(135deg,#73a5ff,#5477f5);position:fixed;opacity:0;transition:all .4s cubic-bezier(.215,.61,.355,1);border-radius:2px;cursor:pointer;text-decoration:none;max-width:calc(50% - 20px);z-index:2147483647}.toastify.on{opacity:1}.toast-close{background:transparent;border:0;color:#fff;cursor:pointer;font-family:inherit;font-size:1em;opacity:.4;padding:0 5px}.toastify-right{right:15px}.toastify-left{left:15px}.toastify-top{top:-150px}.toastify-bottom{bottom:-150px}.toastify-rounded{border-radius:25px}.toastify-avatar{width:1.5em;height:1.5em;margin:-7px 5px;border-radius:2px}.toastify-center{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content;max-width:-moz-fit-content}@media only screen and (max-width:360px){.toastify-right,.toastify-left{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content}}";class u extends c{static properties={imagePreviewUrl:{type:String}};static selfCSS=s`
    :host {
        display: block;
        min-height: 500px;
    }
    /* Reserva espacio para la cabecera oscura */
    nav {
        min-height: 160px; /* Evita que el nav salte al cargar los pasos */
    }
    /* Reserva espacio para el título */
    h1 {
        line-height: 1;
        min-height: 40px;
    }
    /* Evita que los pasos ocultos ocupen espacio o causen saltos */
    .hidden {
        display: none !important;
    }
`;static styles=[this.selfCSS,s`${l(p)}`,s`${l(f)}`];constructor(){super(),this.step=null,this.loading=!1,this.steps=[{id:1,name:"Identificate",description:"Ingresa tu correo electrónico para validar tus órdenes.",active:!0,block:!1},{id:2,name:"Ordenes a tu nombre",description:"Seleciona la orden que deseas pagar",active:!1,block:!1},{id:3,name:"Sube tu comprobante",description:"Adjunta una imagen que demuestre tu pago.",active:!1,block:!1},{id:4,name:"Resultado",description:"Estado de validacion",active:!1,block:!1}],this.form={},this.errorCaptured=null,this.orders=[];const t=new URLSearchParams(window.location.search).get("step");if(t){const a=parseInt(t);a>=1&&a<=this.steps.length&&this.setActiveStep(a)}}setActiveStep(e){this.steps=this.steps.map(t=>(t.active=t.id===e,t)),this.requestUpdate()}setBlockStep(e){this.steps=this.steps.map(t=>(t.id===e&&(t.block=!0),t)),this.requestUpdate()}hadleCompleteValidation(){const e=this.shadowRoot.getElementById("payment-validation-form"),a=new FormData(e).get("email");if(this.form.email=a,!a){r({text:"Por favor ingresa un correo electrónico válido.",duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast();return}try{this.loading=!0,d.getOrdersByEmail(a).then(i=>{if(i.length===0)throw new Error("No se encontraron órdenes para este correo.");this.orders=i,this.setBlockStep(1),this.setActiveStep(2),this.loading=!1}).catch(i=>{r({text:i.message,duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast()}).finally(()=>{this.loading=!1})}catch(i){r({text:i.message,duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast()}}async handleSendProof(){try{const e=this.shadowRoot.getElementById("payment-validation-form"),t=new FormData(e);if(!e.querySelector('input[name="payment_proof"]').files[0]){r({text:"Por favor adjunta un comprobante de pago.",duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast();return}t.append("email",this.form.email),t.append("step",2),t.append("order_id",this.orders[0].id),this.loading=!0;const n=await d.sendPaymentProof(t);if(n.success)r({text:"Comprobante enviado exitosamente. Estamos validando tu pago.",duration:3e3,gravity:"top",position:"center",backgroundColor:"#48bb78"}).showToast(),this.setBlockStep(3),this.setActiveStep(4);else throw new Error(n.data||"Error al enviar el comprobante.")}catch(e){r({text:e.message,duration:3e3,gravity:"top",position:"center",backgroundColor:"#f56565"}).showToast()}finally{this.loading=!1}}seletOrder(e){this.form.orderId=e,this.setBlockStep(2),this.setActiveStep(3)}handleBackStep(e,t=!1){this.setActiveStep(e),t&&(this.orders=[])}handleRenderEmailForm(){return o`
        <input type="email" name="email" placeholder="Correo electrónico" class="w-full mb-4 p-2 border border-white rounded-sm" required>
        <button type="button" @click=${()=>this.hadleCompleteValidation()} class="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Completar validación</button>
        `}handleRenderOrders(){return o`
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${this.orders.map(e=>o`
                <div class="border p-4 rounded-md">
                    <h3 class="text-lg font-semibold mb-2">Orden #${e.order_number}</h3>
                    <p><strong>Correo:</strong> ${e.customer_email}</p>
                    <p><strong>Rifa:</strong> ${e.raffle.title}</p>
                    <p><strong>Fecha:</strong> ${new Date(e.created_at).toLocaleDateString()}</p>
                    <button type="button" @click=${()=>{this.seletOrder(e.id)}} class="cursor-pointer mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Seleccionar esta orden</button>
                </div>
            `)}
        </div>
        <button type="button" @click=${()=>this.handleBackStep(1,!0)} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Atras</button>`}handlePreviewProof(){const a=this.shadowRoot.getElementById("payment-validation-form").querySelector('input[name="payment_proof"]').files[0];if(a){const i=URL.createObjectURL(a);this.imagePreviewUrl=i}}handleRenderUploadProof(){return o`
        <div class="flex items-center justify-center w-full mb-6">
            <label for="payment_proof" class="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium">
                <div class="flex flex-col items-center justify-center text-body pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"/></svg>
                    <p class="mb-2 text-sm"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs">PNG, JPG</p>
                </div>
                <input id="payment_proof" type="file" class="hidden" name="payment_proof" @change=${()=>this.handlePreviewProof()} />
            </label>
        </div> 
        ${this.imagePreviewUrl?o`<img src="${this.imagePreviewUrl}" alt="Vista previa del comprobante" class="w-full max-h-64 object-contain mb-4 p-2 rounded-md">`:""}
        <div class="flex justify-center gap-4 items-center">
            <button type="button" @click=${()=>this.handleBackStep(2,!1)} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Atras</button>
            <button type="button" @click=${()=>this.handleSendProof()} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Enviar comprobante</button>
        </div>
        `}connectedCallback(){super.connectedCallback()}render(){return o`
        <div>
            <nav class="w-full bg-red-500 text-white p-4 rounded-t-md mb-6">
                <div class="flex flex-col gap-2">
                    <h1 class="text-4xl text-center font-bold">Validación de Pago</h1>
                    <ul class="flex items-center justify-center space-x-10 mt-6">
                        ${this.steps.map(e=>o`
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
            <form role="form" id="payment-validation-form" class="w-full">
                ${this.loading?o`
                    <div class="w-full h-64 flex items-center justify-center"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div></div>
                `:o`
                <div>
                    ${this.steps.map(e=>o`
                    <div class="w-full mb-4 p-4 ${e.active?"block":"hidden"}">
                        <h2 class="text-4xl text-center font-semibold mb-2">${e.name}</h2>
                        <p class="text-2xl! text-gray-200 text-center">${e.description}</p>
                    </div>
                    
                    <div class="p-2 max-w-4xl mx-auto flex flex-col items-center justify-center">

                        ${e.id===1&&e.active===!0?this.handleRenderEmailForm():""}
                        
                        ${e.id===2&&e.active===!0?o`${this.handleRenderOrders()}`:""}

                        ${e.id===3&&e.active===!0?this.handleRenderUploadProof():""}
                        
                        ${e.id===4&&e.active===!0?o`
                            <p class="text-white">Validación completada exitosamente.</p>
                            <p class="text-white">Una vez validado tu pago, enviaremos un correo notificando la orden.</p>
                        `:""}
                    </div>
                `)}
                </div>`}
                
                <div class="w-full">
                </div>
            </form>
        </div>
        `}}customElements.define("raffle-payment-validation",u);
