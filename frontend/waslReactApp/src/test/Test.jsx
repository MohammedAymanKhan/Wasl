import { Avatar, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useEffect, useRef, useState } from 'react'
import { fetchCalls } from './fetchCalls';
import Loader from '@/components/Loader';

export const Test = () => {

  const [nextPage, setNextPage] = useState();
  const { calls, loading, error } = fetchCalls();

  if(loading) return <Loader/>

  if(error){
    console.log("error", error)
    return;
  } 

   const observer = useRef();
    const lastElementRef =useRef();
  // useEffect(() => {

  //   const observerFun = new IntersectionObserver(entries => {
  //     console.log('entries:', entries);
  //     console.log('called');
  //   }, { threshold: 1.0 });
  //   observerFun.observe(lastElementRef.current);

  // },[]);

  return(
     <div className='text-white h-[100px] w-[500px] overflow-y-scroll'>
      <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam rerum nemo id ea velit ipsum repellat libero quod iure voluptatem. Nam reiciendis iure mollitia cumque corrupti dolorem ducimus consectetur libero.
       .</h2>      
    </div>
  );
}

