import TemplatePointers from "../TemplatePointers"

function LandingIntro(){

    return(
        <div className="hero min-h-full rounded-l-xl bg-base-200">
            <div className="hero-content py-12">
              <div className="max-w-md">

              <h1 className='text-3xl text-center font-bold '><img src="/logo.png" className="w-12 inline-block mr-2 mask mask-circle" alt="VisualVerse logo" />VisualVerse</h1>

                {/* <div className="text-center mt-12"><img src="./intro.png" className="w-52 inline-block"></img></div> */}
                <div className="text-center mt-12"><img src="./intro.png" className="object-contain h-52 w-96"></img></div>

              
              {/* Importing pointers component */}
              <TemplatePointers/>
              
              </div>

            </div>
          </div>
    )
      
  }
  
  export default LandingIntro