//---------------------------------------------
// CONFIGURATION
//---------------------------------------------

const SUPABASE_URL="https://TONPROJET.supabase.co";

const SUPABASE_ANON_KEY="TON_ANON_KEY";

const bucketName="giha-documents";

const ACCESS_CODE="GIHA2026";

//---------------------------------------------
// INITIALISATION
//---------------------------------------------

const supabaseClient=supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

//---------------------------------------------
// AUTHENTIFICATION SIMPLE
//---------------------------------------------

function checkAccess(){

    const access=localStorage.getItem("giha_access");

    if(access==="granted"){
        return true;
    }

    showLoginScreen();

    return false;
}


function showLoginScreen(){

document.body.innerHTML=`

<div style="
max-width:450px;
margin:80px auto;
padding:35px;
background:white;
border-radius:14px;
box-shadow:0 5px 20px rgba(0,0,0,.15);
font-family:Arial">

<h2>Accès Bibliothèque GiHA RDC</h2>

<p>Veuillez saisir le code d'accès partagé.</p>

<input
id="accessInput"
type="password"
placeholder="Code d'accès"
style="
width:100%;
padding:12px;
margin-top:10px;
border:1px solid #ccc;
border-radius:8px">

<button
onclick="login()"
style="
margin-top:15px;
width:100%;
padding:12px;
background:#448BCA;
color:white;
border:none;
border-radius:8px">

Se connecter

</button>

<div
id="error"
style="
color:red;
margin-top:10px">
</div>

</div>

`;
}


function login(){

const code=document
.getElementById("accessInput")
.value;

if(code===ACCESS_CODE){

localStorage.setItem(
"giha_access",
"granted"
);

location.reload();

}
else{

document
.getElementById("error")
.innerHTML="Code incorrect";

}

}


function logout(){

localStorage.removeItem(
"giha_access"
);

location.reload();

}


//---------------------------------------------
// VERIFICATION
//---------------------------------------------

if(!checkAccess()){
throw new Error(
"Accès refusé"
);
}


//---------------------------------------------
// AJOUT BOUTON DECONNEXION
//---------------------------------------------

window.addEventListener(
"load",
()=>{

const btn=document.createElement(
"button"
);

btn.innerHTML="Déconnexion";

btn.style.position="fixed";

btn.style.top="20px";

btn.style.right="20px";

btn.style.background="#f58220";

btn.style.color="white";

btn.style.border="none";

btn.style.padding="10px 15px";

btn.style.borderRadius="8px";

btn.style.cursor="pointer";

btn.onclick=logout;

document.body.appendChild(btn);

});
    

//---------------------------------------------
// CREER DOSSIER
//---------------------------------------------

async function createFolder(){

const folderName=document
.getElementById(
"folderName"
)
.value.trim();

if(!folderName){

alert(
"Saisir un nom"
);

return;

}

const path=
`${folderName}/.keep`;

const emptyFile=
new Blob(
[""],
{
type:
"text/plain"
}
);

const {error}=await
supabaseClient
.storage
.from(bucketName)
.upload(
path,
emptyFile,
{
upsert:true
}
);

if(error){

alert(
error.message
);

return;

}

alert(
"Dossier créé"
);

loadFolders();

loadFiles();

document
.getElementById(
"folderName"
)
.value="";

}



//---------------------------------------------
// CHARGER DOSSIERS
//---------------------------------------------

async function loadFolders(){

const {data,error}
=
await supabaseClient
.storage
.from(bucketName)
.list("");

if(error){

console.log(error);

return;

}

const select=
document
.getElementById(
"folderSelect"
);

select.innerHTML=
`
<option value="">
Racine principale
</option>
`;

data.forEach(item=>{

if(
!item.name.includes(".")
){

const option=
document.createElement(
"option"
);

option.value=
item.name;

option.textContent=
item.name;

select.appendChild(
option
);

}

});

}



//---------------------------------------------
// UPLOAD FICHIER
//---------------------------------------------

async function uploadFile(){

const input=
document
.getElementById(
"fileInput"
);

if(
!input.files.length
){

alert(
"Sélectionner un fichier"
);

return;

}

const folder=
document
.getElementById(
"folderSelect"
)
.value;

const file=
input.files[0];

const path=
folder
?
`${folder}/${file.name}`
:
file.name;


const {error}=
await supabaseClient
.storage
.from(bucketName)
.upload(
path,
file,
{
upsert:true
}
);

if(error){

alert(
error.message
);

return;

}

alert(
"Upload réussi"
);

input.value="";

loadFiles();

}



//---------------------------------------------
// LISTER FICHIERS
//---------------------------------------------

async function loadFiles(path=""){

const {data,error}
=
await supabaseClient
.storage
.from(bucketName)
.list(path);

if(error){

return;

}

const list=
document
.getElementById(
"fileList"
);

list.innerHTML="";

for(
const item
of data
){

if(
item.name
===".keep"
){

continue;

}

const fullPath=
path
?
`${path}/${item.name}`
:
item.name;

if(
!item.metadata
){

const div=
document
.createElement(
"div"
);

div.className=
"file-item";

div.innerHTML=
`
📁
<strong>
${item.name}
</strong>

<br>

<button onclick=
"loadFiles('${fullPath}')">
Ouvrir
</button>
`;

list.appendChild(
div
);

}
else{

const url=
supabaseClient
.storage
.from(bucketName)
.getPublicUrl(
fullPath
);

const div=
document
.createElement(
"div"
);

div.className=
"file-item";

div.innerHTML=
`
📄
<a href=
"${url.data.publicUrl}"
target="_blank">

${item.name}

</a>
`;

list.appendChild(
div
);

}

}

}


//---------------------------------------------
// INITIALISATION
//---------------------------------------------

loadFolders();

loadFiles();
