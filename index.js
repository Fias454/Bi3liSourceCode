import { useEffect, useState } from "react";
import ReactDom from "react-dom/client";
import {Link, animateScroll as scroll} from "react-scroll";
import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
const root = document.getElementById("root");
const MainRoot = ReactDom.createRoot(root);
function HeaderLogoMain(){
    return(
        <>
            <div className="ml-[25%] w-[50%]">
                <img className="rounded-full w-full h-48 mt-2 border-white border-[5px]" src="./BI3li (4).svg" alt="LogoMain"></img>
            </div>
        </>
    )
}
function Header(){
    return(
        <>
            <header className="fixed top-0 left-0 w-full h-16 bg-black md:flex xl:flex flex-nowrap">
                <HeaderLogoMain />
            </header>
        </>
    )
}
//<button className="h-full text-6xl font-thin text-white basis-1/2"><i class="fa fa-search"></i></button>

function FooterMainControlBtn({Naviagte}){
    return(
        <>
            <div className="flex h-full basis-1/2 flex-nowrap">
                <button onClick={()=>Naviagte("/")} className="h-full transition-all basis-1/2 text-slate-500 hover:text-white"><i class="fa fa-home"></i></button>
                <button onClick={()=>Naviagte("/Post")} className="h-full text-red-200 transition-all basis-1/2 bg-slate-800 hover:text-slate-500"><i class="fa fa-plus"></i></button>
            </div>
        </>
    )
}

function FooterUtilBtn({Naviagte}){
    return(
        <>
            <div className="flex h-full p-2 basis-1/2 flex-nowrap">
            <button onClick={()=>Naviagte("/Search")} className="basis-1/2 h-full transition-all rounded-sm  ml-0.5 text-slate-400 font-light hover:text-white"><i className=" fa fa-search"></i></button>
            <button onClick={()=>Naviagte("/Account")} className="basis-1/2 h-full transition-all  ml-0.5 text-slate-500 text-xl hover:text-white"><i class=" fa fa-user"></i></button>
            </div>
        </>
    )
}
function Footer({FooterDisplaySet}){
    const Naviagte = useNavigate();
    return(
        <>
        <footer className={`${FooterDisplaySet} h-10 fixed mt-10  flex flex-nowrap bottom-0 left-0 w-full bg-gradient-to-b from-black to-slate-950`}>
            <FooterMainControlBtn Naviagte={Naviagte}/>
            <FooterUtilBtn Naviagte={Naviagte}/>
        </footer>
        </>
    )
}

async function SignUPsubmit(name,gmail,password,setNameAlert, setGmailAlert,setPasswordAlert,Naviagte){
    try{
        if(name.length >4 && gmail.length >4 && password.length >4){
            const PasswordRegExCheckers = /[./;#:>?><|!"£$%^&]/;
            if(PasswordRegExCheckers.test(password)){
                const call = await fetch("http://localhost:5000/SignUp", {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({name,gmail,password}),
                    credentials:"include"
                });
                const resp = await call.json();
                if(resp.success){
                    Naviagte("/");
                }else if(resp.isGmail){
                    setGmailAlert("Email is already taken!!!!");
                    setTimeout(()=>{
                        setGmailAlert("");
                    },1000);
                }else if(resp.isName){
                    setNameAlert("Name is already taken!!!!");
                    setTimeout(()=>{
                        setNameAlert("");
                    },1000);
                }
            }else{
                setPasswordAlert(`Password must include at least one of these: ${PasswordRegExCheckers}!!!`);
                setTimeout(()=>{
                    setPasswordAlert("");
                },1000);
            }
        }
        if(name.length <4){
            setNameAlert("Name is too short!!!!");
            setTimeout(()=>{
                setNameAlert("");
            },1000);
        }
        if(gmail.length <4){
            setGmailAlert("Gmail is too short!!!!");
            setTimeout(()=>{
                setGmailAlert("");
            },1000);
        } 
        if(password.length <6){
            setPasswordAlert("Password is too short!!!!");
            setTimeout(()=>{
                setPasswordAlert("");
            },1000);
        }
    }catch(err){
        console.error(err);
    }
}

function SignUpPage(){
    const navigate = useNavigate();
    const [nameValue, setNameValue] = useState("");
    const [nameAlert, setNameAlert] = useState("");
    const [gmailValue, setGmailValue] = useState("");
    const [gmaiAlert, setGmailAlert] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [passwordAlert, setPasswordAlert] = useState("");
    return(
        <>
        <section className="w-[90%] ml-[5%] h-fit">
            <div className="w-full m-1 h-9">
                <p className="text-2xl text-white">Make new Account:</p>
            </div>
            <div className="w-full mb-2 text-white h-fit">
                <input value={nameValue} onChange={(e)=>ControlSubmitForm(e, setNameValue, 15, setNameAlert, "Name cant be longer than 15 charchters")} placeholder="Name" maxLength={16} className="w-full h-11 p-2 pl-3 rounded-[30px] bg-black text-white shadow-md shadow-black  border-none outline-none"></input>
                <p className="text-red-500">{nameAlert}</p>
            </div>
            <div className="w-full mb-2 h-fit">
                <input value={gmailValue} onChange={(e)=>ControlSubmitForm(e, setGmailValue, 20, setGmailAlert, "Gmail cant be longer than 20 charchters")} placeholder="Gmail" maxLength={21} className="w-full h-11 p-2 pl-3 rounded-[30px] bg-black text-white shadow-md shadow-black  border-none outline-none"></input>
                <p className="text-red-500">{gmaiAlert}</p>
            </div>
            <div className="w-full mb-2 h-fit">
                <input value={passwordValue} onChange={(e)=>ControlSubmitForm(e, setPasswordValue, 30, setPasswordAlert, "Passwords cant be longer than 30 charchters")}  placeholder="Password" maxLength={31} className="w-full h-11 p-2 pl-3 rounded-[30px] bg-black text-white shadow-md shadow-black  border-none outline-none"></input>
                <p className="text-red-500">{passwordAlert}</p>
            </div>
            <div className="w-full mt-3 mb-3 h-fit">
                <button onClick={()=>SignUPsubmit(nameValue, gmailValue, passwordValue, setNameAlert,setGmailAlert,setPasswordAlert, navigate)} className="w-[50%] ml-[25%] h-11 text-black rounded-xl text-2xl p-1 bg-stone-400">Sign in</button>
            </div>
            <div className="w-full mt-3 h-fit">
                    <hr className="h-1 bg-black"></hr>
                </div>
            <div className="w-full mb-4 h-fit">
                <button className="flex w-full h-10 mr-1 text-red-600 underline transition-all rounded-md hover:text-red-800 flex-nowrap"><p className="w-full text-center">Already have an account? log in here!!!</p></button>
            </div>
        </section>
        </>
    )
}
function PulsePageMain(navigate,setPulseState, url){
    setPulseState("Set");
    setTimeout(()=>{
        navigate(url);
        setPulseState("");
    },501);
}
function LogInMain(){
    const navigate = useNavigate();
    const [pulseState, setPulseState] = useState("");
    return(
        <>
            <section className={!pulseState? "w-[97%] ml-[1.5%] h-fit bg-gradient-to-bl p-2":"w-[97%] ml-[1.5%] h-fit bg-gradient-to-bl animate-pulse duration-1000 p-2"}>
                <div className="w-full mb-4 h-fit">
                    <p className="text-2xl text-white">Log in with:</p>
                </div>
                <div className="w-full mb-4 h-fit">
                    <button className="w-full h-10 pl-4 mr-1 transition-all bg-white rounded-md hover:bg-slate-400 text-start hover:text-slate-900"><i className="mr-2 fa fa-envelope"></i>Log in with Google</button>
                </div>
                <div className="w-full mb-4 h-fit">
                    <button onClick={()=>PulsePageMain(navigate, setPulseState, "/LogIn")} className="flex w-full h-10 mr-1 transition-all bg-white rounded-md hover:bg-slate-400 hover:text-slate-900 flex-nowrap"><img src="./BI3li (4).svg" className="h-full p-1 rounded-full basis-1/5" alt="Logo"></img><p className="p-2 text-start basis-4/5">Log in with BI3LI</p></button>
                </div>
                <div className="w-full h-fit">
                    <hr className="h-1 bg-black"></hr>
                </div>
                <div className="w-full mb-4 h-fit">
                    <button onClick={()=>PulsePageMain(navigate, setPulseState, "/SignUp")} className="flex w-full h-10 mr-1 text-red-600 underline transition-all rounded-md hover:text-red-800 flex-nowrap"><p className="w-full text-center">Dont have an account? Sign up here!!!</p></button>
                </div>
            </section>
        </>
    )
}
function MainAccountPage(){
    return(
        <>
            <LogInMain/>
        </>
    )
}
async function SubmitPost(nameValue, descriptionValue, imgValue, nameAlert, descriptionAlert, imgAlert, tunisianCities,location, price, facebookLink, instaLink, whatsUpLink, number, category){
    const tunisianPhoneRegex = /^(2|5|7|9)\d{7}$/;
    if(nameValue.length <= 40 && descriptionValue.length <=400 && imgValue &&tunisianCities.includes(location) && price && (facebookLink.length <= 101 || instaLink.length <= 101 || whatsUpLink.length <= 101) && tunisianPhoneRegex.test(number) && category){
        const formData = new FormData();
        console.log(nameValue, descriptionValue, imgValue)
        formData.append("nameValue", nameValue);
        formData.append("descriptionValue",descriptionValue);
        formData.append("imgValue",imgValue);
        formData.append("location", location);
        formData.append("facebookLink", facebookLink);
        formData.append("instaLink", instaLink);
        formData.append("whatsUpLink", whatsUpLink);
        formData.append("number", number);
        formData.append("price", price);
        formData.append("category", category);
        const call = await fetch("http://localhost:5000/SubmitProduct", {
            method:"POST",
            body: formData,
            credentials: "include"
        });
        const resp = await call.json();
        if(resp.success){
            console.log("WOW");
        }else if(resp.name){
            ErrorMessage(nameAlert, "name already taken", 5000);
        }else if(resp.description){
            ErrorMessage(descriptionAlert, "descrption already taken", 5000);
        }
    }
    if(nameValue.length > 40 || !nameValue){
        ErrorMessage(nameAlert, "Name must be under 40 characters", 5000);
    }
    if(descriptionValue.length >400 || !descriptionValue){
        ErrorMessage(descriptionAlert, "descriptionValue must be under 400 characters", 5000);
    }
    if(!imgValue){
        ErrorMessage(imgAlert, "you must include an image along side your proudct", 5000);
    }
}
//animate-pulse duration-1000
function PostPageMain(){
    const navigate = useNavigate();
    const tunisianCities = [
        "Tunis", "Sfax", "Sousse", "Kairouan", "Gabes", "Kasserine", "Nabeul", "Zaghouan", "Medenine", "Bizerte",
        "Monastir", "Gafsa", "Beja", "Tataouine", "Jendouba", "Siliana", "Mahdia", "Nabeul",
    ];
    const productCategories = ['Electronics', 'Clothing', 'Home Appliances', 'Books', 'Toys', 'Beauty & Personal Care', 'Sports & Outdoors', 'Automotive', 'Food & Beverage', 'Health & Wellness', 'Furniture', 'Garden & Outdoor', 'Pet Supplies', 'Office Supplies'];
    const [nameValue, setNameValue] = useState("");
    const [nameAlert, setNameAlert] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [descriptionValueMax, setDescriptionValueMax] = useState(400);
    const [descriptionAlert, setDescriptionAlert] = useState("");
    const [imgValue, setImgValue] = useState("");
    const [imgAlert, setImgAlert] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState();
    const [facebook, setFacebook] = useState("");
    const [insta, setInsta] = useState("");
    const [whatsUp, setWhatsup] = useState("");
    const [number, setNumber] = useState("");
    const [category, setCategory] = useState("");
    return(
        <>
            <section className="h-fit w-[90%] ml-[5%]">
                <div className="pl-1 m-1 text-white border-l-2 border-blue-500 h-fit">
                    <p className="inline-block w-fit">Before you post, the posting may automatically track your location,<span className="inline-block text-red-600 underline cursor-pointer w-fit" onClick={()=>navigate("/Settings")}>you can disable it here</span></p>
                </div>
                <div className="w-full p-2 h-fit">
                    <label htmlFor="ImgProduct" className="block w-full h-24 p-2 text-2xl text-white bg-black rounded-3xl"><span><i class="fa fa-camera text-4xl inline" aria-hidden="true"></i><p className="inline ml-2 text-3xl text-center">Upload image</p></span></label>
                    <input onChange={(e)=>setImgValue(e.target.files[0])} type="file" className="hidden" id="ImgProduct"></input>
                    <p className={!nameAlert?"":"p-2 text-xl text-red-600 animate-pulse duration-5000"}>{imgAlert}</p>
                </div>
                <div>
                    <input value={nameValue}  onChange={(e)=>ControlSubmitForm(e,setNameValue,30,setNameAlert,"Product name cant be longer than 30 charcters" )} placeholder="Product name" maxLength={31} className="w-full h-11 p-2 pl-3 rounded-[30px] bg-black text-white shadow-md shadow-black  border-none outline-none"></input>
                    <p className={!descriptionAlert?"":"p-2 text-xl text-red-600 animate-pulse duration-5000"}>{nameAlert}</p>
                </div>
                <div className="w-full mt-2 h-fit">
                    <span className="w-full h-40 block p-2 pl-3 rounded-[30px] bg-slate-800 text-white shadow-md shadow-slate-600  border-none outline-none">
                        <textarea value={descriptionValue} onChange={(e)=>ControlProductDescriptionSubmit(e,setDescriptionValue,400, setDescriptionValueMax,setDescriptionAlert, "Product description cant be longer than 400 chars")} maxLength={401} placeholder="Product description....." className="w-full border-none outline-none resize-none bg-inherit h-2/3"></textarea>
                        <span><p className={!imgAlert?"":"p-2 text-xl text-red-600 animate-pulse duration-5000"}>{descriptionAlert}</p><p className="inline float-right pt-1">{descriptionValueMax}</p></span>
                    </span>
                </div>
                <div className="flex w-full mt-3 bg-black rounded-lg h-28 flex-nowrap">
                    <div className="p-1 text-xl basis-1/2">
                        <select className="h-full text-white bg-black scroll-smooth" onChange={(e)=>setLocation(e.target.value)}>
                            {tunisianCities.map((item, index)=>(
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div className="p-2 text-xl basis-1/2">
                        <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price..." type="number" className="h-full text-white bg-black border-none outline-none"></input>
                    </div>
                </div>
                <div className="w-full mt-3 text-white bg-black border-none rounded-lg h-fit">
                    <div className="flex w-full h-14 flex-nowrap"><i className="fa fa-facebook-square basis-1/5" aria-hidden="true"></i><input maxLength={100} value={facebook} onChange={(e)=>setFacebook(e.target.value)} placeholder="Facebook link..." className="p-2 bg-black border-none outline-none basis-4/5"></input></div>
                    <div className="flex w-full h-14 flex-nowrap"><i className="fa fa-facebook-square basis-1/5" aria-hidden="true"></i><input maxLength={100} value={insta} onChange={(e)=>setInsta(e.target.value)} placeholder="Instagram link..." className="p-2 bg-black border-none outline-none basis-4/5"></input></div>
                    <div className="flex w-full h-14 flex-nowrap"><i className="fa fa-facebook-square basis-1/5" aria-hidden="true"></i><input maxLength={100} value={whatsUp} onChange={(e)=>setWhatsup(e.target.value)} placeholder="Whatsup link..." className="p-2 bg-black border-none outline-none basis-4/5"></input></div>
                </div>
                <div className="w-full mt-3 text-white bg-black border-none rounded-lg h-fit">
                    <input maxLength={9} value={number} onChange={(e)=>setNumber(e.target.value)} placeholder="Number..." type="number" className="p-2 bg-black border-none outline-none basis-4/5"></input>
                </div>
                <div className="w-full h-20 mt-3 text-white bg-black rounded-lg">
                <div className="w-full h-full p-1 text-xl basis-1/2">
                        <select className="w-full h-full text-white bg-black scroll-smooth" onChange={(e)=>setCategory(e.target.value)}>
                            {productCategories.map((item, index)=>(
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="w-full pb-24 mt-5 h-9">
                    <button onClick={()=>SubmitPost(nameValue, descriptionValue, imgValue, setNameAlert,setDescriptionAlert,setImgAlert, tunisianCities,location,price, facebook, insta, whatsUp, number, category)} className="w-[50%] ml-[25%] h-12 mr-1 text-2xl text-white bg-black hover:bg-white border-4 border-white rounded-[30px] ">Submit</button>
                </div>
                
            </section>
        </>
    )
}
function ErrorMessage(param, errMessage,dur){
    if(param && dur){
        param(errMessage);
        setTimeout(()=>{
            param("");
        },dur);
    }
}
function ControlSubmitForm(e,setValue,limit, setAlert,ErrorMessage){
    const element = e.target.value;
    if(element.length <=limit){
        setValue(element);
    }else{
        setAlert(ErrorMessage);
        setTimeout(()=>{
            setAlert("");
        }, 1000);
    }
}
function ControlProductDescriptionSubmit(e,setValue,limit, setLimit,setAlert,ErrorMessage){
    const element = e.target.value;
    if(element.length <=limit){
        setValue(element);
        setLimit(limit-element.length);
    }else{
        setAlert(ErrorMessage);
        setTimeout(()=>{
            setAlert("");
        }, 1000);
    }
}
//
async function LogINSumbit(name,gmail,password,setNameAlert, setGmailAlert,setPasswordAlert,Naviagte){
    try{
        if(name.length >4 && gmail.length >4 && password.length >4){
            const PasswordRegExCheckers = /[./;#:>?><|!"£$%^&]/;
            if(PasswordRegExCheckers.test(password)){
                const call = await fetch("http://localhost:5000/LogIn", {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({name,gmail,password}),
                    credentials:"include"
                });
                const resp = await call.json();
                if(resp.success){
                    Naviagte("/");
                }else if(resp.isGmail){
                    ErrorMessage(setGmailAlert, "name unvalid",1000);
                }else if(resp.isName){
                    ErrorMessage(setNameAlert, "Wrong name!!!",1000);
                }
            }else{
                ErrorMessage(setPasswordAlert,`Password must include at least one of these: ${PasswordRegExCheckers}!!!`,1000);
            }
        }
        if(name.length <4){
            ErrorMessage(setNameAlert, "name unvalid",1000);
        }
        if(gmail.length <4){
            ErrorMessage(setGmailAlert, "gmail unvalid",1000);
        } 
        if(password.length <6){
            ErrorMessage(setPasswordAlert, "password unvalid",1000);
        }
    }catch(err){
        console.error(err);
    }
}

//
function LogeInPage(){
    const navigate = useNavigate();
    const [nameValue, setNameValue] = useState("");
    const [nameAlert, setNameAlert] = useState("");
    const [gmailValue, setGmailValue] = useState("");
    const [gmaiAlert, setGmailAlert] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [passwordAlert, setPasswordAlert] = useState("");
    return(
        <>
        <section className="w-[90%] ml-[5%] h-fit">
            <div className="w-full m-1 h-9">
                <p className="text-2xl text-white">Log in:</p>
            </div>
            <div className="w-full mb-2 text-white h-fit">
                <input value={nameValue} onChange={(e)=>ControlSubmitForm(e, setNameValue, 15, setNameAlert, "Name cant be longer than 15 charchters")} placeholder="Name" maxLength={16} className="w-full h-11 p-2 pl-3 rounded-[30px] bg-black text-white shadow-md shadow-black  border-none outline-none"></input>
                <p className="text-red-500">{nameAlert}</p>
            </div>
            <div className="w-full mb-2 h-fit">
                <input value={gmailValue} onChange={(e)=>ControlSubmitForm(e, setGmailValue, 20, setGmailAlert, "Gmail cant be longer than 20 charchters")} placeholder="Gmail" maxLength={21} className="w-full h-11 p-2 pl-3 rounded-[30px] bg-black text-white shadow-md shadow-black  border-none outline-none"></input>
                <p className="text-red-500">{gmaiAlert}</p>
            </div>
            <div className="w-full mb-2 h-fit">
                <input value={passwordValue} onChange={(e)=>ControlSubmitForm(e, setPasswordValue, 30, setPasswordAlert, "Passwords cant be longer than 30 charchters")}  placeholder="Password" maxLength={31} className="w-full h-11 p-2 pl-3 rounded-[30px] bg-black text-white shadow-md shadow-black  border-none outline-none"></input>
                <p className="text-red-500">{passwordAlert}</p>
            </div>
            <div className="w-full mt-3 mb-3 h-fit">
                <button onClick={()=>LogINSumbit(nameValue, gmailValue, passwordValue, setNameAlert,setGmailAlert,setPasswordAlert, navigate)} className="w-[50%] ml-[25%] h-11 text-black rounded-xl text-2xl p-1 bg-stone-400">Sign in</button>
            </div>
            <div className="w-full mt-3 h-fit">
                    <hr className="h-1 bg-black"></hr>
                </div>
            <div className="w-full mb-4 h-fit">
                <button className="flex w-full h-10 mr-1 text-red-600 underline transition-all rounded-md hover:text-red-800 flex-nowrap"><p className="w-full text-center">Dont have an account? sign up here!!!</p></button>
            </div>
        </section>
        </>
    )
}
async function NestMain(Content){
    try{
        const call = await fetch("http://localhost:5000/NestMain",{
            method: "GET",
            credentials: "include"
        });
        const resp = await call.json();
        if(resp.success){
            Content(resp.content);
        }else{
            console.error(404,"Content wasnt found!!!");
        }
    }catch(err){
        console.error(err)
    }
}
async function ScrollForward(Content){
    try{
        const call = await fetch("http://localhost:5000/ScrollForwardMain",{
            method: "GET",
            credentials: "include"
        });
        const resp = await call.json();
        if(resp.success){
        Content([]);
            Content(resp.content);
        }
    }catch(err){
        console.error(err)
    }
}
async function ScrollBackward(Content){
    try{
        const call = await fetch("http://localhost:5000/ScrollBackward",{
            method: "GET",
            credentials: "include"
        });
        const resp = await call.json();
        if(resp.success){
            Content([]);
            Content(resp.content);
        }
    }catch(err){
        console.error(err)
    }
}
function FeedSecondSection(){
    return(
        <>
        
        </>
    )
}
function FeedMainSection(){
    const naviagte = useNavigate();
    const [nestMain, setNestMain] = useState([]);
    useEffect(()=>{
        NestMain(setNestMain);
    }, []);
    return(
        <>
            <section onDrag={(e)=>{console.log("weqwe")}}>
                <div className="w-[90%] ml-[5%]  h-fit xl:grid xl:grid-cols-3">
                   {nestMain.map((item,index)=>(
                         <div onClick={()=>SaveProductMain(item.productName, naviagte)}  key={index} className="w-full p-2 mb-6 bg-slate-900 h-fit">
                         <div className="w-full h-40">
                             <img className="object-cover w-full h-full" src={"http://localhost:5000/"+item.productImg} alt=""></img>
                         </div>
                         <div className="w-full h-9">
                             <p className="mt-2 text-2xl text-center text-white">{item.productName}</p>
                         </div>
                         <div className="w-full h-9">
                             <p className="mt-2 text-lg text-center"><i className="fa fa-map-marker ml-[1%] text-red-500 mr-[2%]"></i><span className="w-full text-white">{item.productLocation}</span></p>
                         </div>
                     </div> 
                   ))}
                </div>
                <div className={nestMain.length<=0? "hidden":"pb-5 w-[90%] ml-[5%] flex flex-nowrap h-20"}>
                    <button onClick={()=>ScrollBackward(setNestMain)} className={"h-full text-4xl basis-1/2 text-white"}><i className="fa fa-arrow-circle-left"></i></button>
                    <button onClick={()=>ScrollForward(setNestMain)} className={"h-full text-4xl basis-1/2 text-white"}><i className="fa fa-arrow-circle-right"></i></button>
                </div>
            </section>
        </>
    )
}
async function SaveProductMain(productName, navigate){
    if(productName !==""){
        const call = await fetch("http://localhost:5000/SaveMarker", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({productName}),
            credentials: "include"
        });
        const resp = await call.json();
        if(resp.success){
            navigate("/ProductPage");
        }else{
            console.error("marker cant be set", 404);
        }
    }else{
        console.error("marker cant be set", 404);
    }
}
function FeedMainPage(){
    return(
        <>
            <section>
                <FeedSecondSection/>
                <FeedMainSection/>
            </section>
        </>
    )
}
/*
*/
async function Search(setsearchResult,e){
    const searchValue = e.target.value;
    if(searchValue){
        const call = await fetch("http://localhost:5000/Search", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({searchValue})
        });
        const resp = await call.json();
        if(resp.success){
            setsearchResult();
            setsearchResult(resp.content);
        }
    }
    if(searchValue.length ===0){
        setsearchResult([]);
    }
}
function SearchPage(){
    const [searchResult, setsearchResult] = useState([]);
    const naviagte = useNavigate();
    return(
        <>
            <section className="w-[90%] ml-[5%] text-white h-fit">
                <div className="w-full p-2 m-2 bg-black rounded-md h-11">
                    <span className="h-full w-[5%] mr-3"><i className="fa fa-search"></i></span>
                    <input onChange={(e)=>Search(setsearchResult, e)} className="w-[90%] h-full bg-black outline-none border-none" placeholder="Search..."></input>
                </div>
                <div placeholder="w-full h-fit m-2">
                    {searchResult.map((item,index)=>(
                        <div onClick={()=>SaveProductMain(item.productName, naviagte)} key={index}>
                            <div placeholder="w-full inline h-32 mt-3 p-2 flex bg-black flex-nowrap">
                               <img className="inline-block w-1/2 h-full p-2" src={"http://localhost:5000/"+item.productImg}></img><p className="inline-block text-center">{item.productName}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div placeholder="w-full h-fit m-2">
                </div>
            </section>
        </>
    )
}
function MainBrowserPage(){
    return(
        <>
        <FeedMainPage/>
        </>
    )
}
async function NestProductPage(setProduct){
    try{
            const call = await fetch("http://localhost:5000/NestProductPage", {
                method:"GET",
                credentials: "include"
            });
            const resp = await call.json();
            if(resp.success){
                setProduct([resp.content]);
            }else{
                console.error("Cant find the marker", 404);
            }
    }catch(err){
        console.error(err);
    }
}
function ProductPageSection(){
    const [product, setProduct] = useState([]);
    useEffect(()=>{
        NestProductPage(setProduct);
    },[]);
    return(
        <>
            <section className="w-[90%] ml-[5%] h-fit text-2xl text-white">
               {product.map((item,index)=>(
                 <div key={index}><div  className="w-full p-2 h-fit">
                       <img src={"http://localhost:5000/"+item.productImg}></img>
                       <div className="flex mt-4 text-white h-fit flex-nowrap">
                           <span className="basis-1/2"><p className="text-white">Price:{item.productPrice}</p></span>
                           <span className="flex basis-1/2 flex-nowrap"><i className="fa fa-map-marker basis-1/6"></i><p className="basis-5/6">{item.productLocation}</p></span>
                       </div>
                   </div><div className="w-full mt-5 h-fit">
                           <div className="w-[90%] ml-[5%]">
                               <div className="text-white"><p>Product: {item.productName}</p></div>
                           </div>
                           <div className="w-[80%] ml-[10%]">
                               <div className="text-white"><p>{item.productDescription}</p></div>
                           </div>
                       </div><div className="w-full mt-5 h-fit">
                        {item.productFacebookLink? <p>{item.productFacebookLink}</p>:""}
                        {item.productInstaLink? <p>{item.productInstaLink}</p>:""}
                        {item.productWhatsUpLink? <p>{item.productWhatsUpLink}</p>:""}
                        {item.productCellPhoneNumber? <p>{item.productCellPhoneNumber}</p>:""}
                       </div></div>
               ))}
            </section>
        </>
    )
}
function Main(){
    return(
        <>
        <main className="w-full h-full">
        <Router>
        <Header/>
        <main className="mt-64 mb-36 w-100vh">
                <Routes>
                    <Route path="/" element={<MainBrowserPage/>}/>
                    <Route path="/Account" element={<MainAccountPage/>}/>
                    <Route path="/SignUp" element={<SignUpPage/>}/>
                    <Route path="/Post" element={<PostPageMain/>}/>
                    <Route path="/LogIn" element={<LogeInPage/>}/>
                    <Route path="/Search" element={<SearchPage/>}/>
                    <Route path="/ProductPage" element={<ProductPageSection/>}/>
                </Routes>
        </main>
        <Footer FooterDisplaySet={"sm:block md:block xl:hidden"}/>
        </Router>
        </main>
        </>
    )
}
MainRoot.render(<Main/>);