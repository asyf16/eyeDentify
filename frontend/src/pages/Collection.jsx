import React, { useEffect, useState } from 'react'
import NavLoggedIn from '../components/NavLoggedIn';
import axios from "axios";


const Collection = () => {
    const loginStatus = localStorage.getItem("user") //100% not null since user must be logged in 
    // userCollection stores the array from the database after get request
    const [userCollection, setUserCollection] = useState([]);

    // fetches array of all images 
    useEffect(() => {
        axios.get(`http://localhost:3001/users/${loginStatus}/retrieve`)
        .then(res => {
            setUserCollection(res.data);
            console.log('get User imgCollection success:', res.data);
        })
        .catch(err => {
            console.error('Error getting user imgCollection:', err);
        })
    }, [])

    // deletes image
    const handleDelete = (AWSCode) => {
        // Send Axios request to backend to delete the item
        axios.post(`http://localhost:3001/users/${loginStatus}/delete`, {AWSCode: AWSCode})
        .then(() => {
            console.log('Successfully deleted item:');
            window.location.reload();
        })
        .catch(err => {
            console.error('Error deleting item:', err);
        });
    };


    return (
        <>
            <NavLoggedIn/>
            <div className='my-1 mb-4 mx-auto w-2/3 p-4 border border-black rounded'>
                <div>
                    <div className='mb-4'>
                        <h1>{`${loginStatus}\'s Uploads`}</h1>
                    </div>
                    
                    {/* Display all photos in the user's collection */}
                    <ul className="col-span-3 grid grid-cols-3 gap-x-8 gap-y-8">
                        {userCollection.map((item, ind) => {
                            return (
                                <li key={ind}>
                                    <div className="group relative">
                                        <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-900/10">
                                            {/* Display Image */}
                                            <img src={item.AWSCode} alt={`Image ${ind}`} className="object-contain max-w-full max-h-fullabsolute inset-0 border border-solid border-gold h-full w-full"/>
                                        </div>
                                        <h4 className="mt-4 text-sm font-medium text-gold group-hover:text-indigo-600">
                                            <a href={item.AWSCode} target="_blank">
                                                {/* <span className="absolute -inset-2.5 z-10"></span> */}
                                                {/* Display Caption */}
                                                <span className="relative">{item.name}</span>
                                            </a>
                                            {/* Delete Button */}
                                            <button className="ml-2 text-red-500 hover:underline hover:cursor-pointer" onClick={() => handleDelete(item.AWSCode)}>Delete</button>
                                            
                                        </h4>
                                    </div>
                                </li>  
                            )
                        })}
                    </ul>

                </div>

            </div>

        </>
    )
}

export default Collection