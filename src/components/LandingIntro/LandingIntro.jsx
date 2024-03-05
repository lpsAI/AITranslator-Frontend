import TemplatePointers from "../TemplatePointers"

function LandingIntro(){

    return(
        <div className="hero min-h-full rounded-l-xl bg-base-200">
            <div className="hero-content py-12">
              <div className="max-w-md">

                {/* <div className="text-center mt-12"><img src="./intro.png" className="w-52 inline-block"></img></div> */}
                <div className="text-center mt-12"><img src="./lps.png" className="object-contain h-52 w-96"></img></div>

              
              {/* Importing pointers component */}
              <TemplatePointers/>
              
              </div>

            </div>
          </div>
    )
      
  }
  
  export default LandingIntro