// import React, {useEffect, useState} from "react";
// import "./AccountPage.css"
// import TokenService from "../../services/TokenService";
// import RequestInstance from "../../utils/RequestInstance"
// import {AccountPageForm} from "./AccountPageForm";

// function AccountPage() {
//     const [data, setData] = useState(null);

//     const user = TokenService.getUser();

//     console.log("before");

//     useEffect(() => {
//         const boi = RequestInstance.get(`http://localhost:8080/users/${user.id}`)
//             .then(response => {
//                 // if (!response.ok) {
//                 //   throw new Error('Network response was not ok');
//                 // }
//                 console.log("data1");
//                 console.log(response.data);
//                 return response.data;
//             })

//             .catch(error => {
//                 console.error('Error fetching user:', error);
//             });

//         const boi2 = async () => {
//             const a = await boi;
//             setData(a);
//             console.log("data3");
//             console.log(data);
//         }

//         boi2();
//     }, []);

//     console.log("after"); //AccountPageForm preloadedData={data}

//     return (
//         data ?
//             <>
//                 <AccountPageForm preloadedData={data}/>
//             </>
//             :
//             <div><img src="loding-veggies.gif"/></div>
//     );
// };

// export default AccountPage;