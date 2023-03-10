
import './App.css';
import { useCallback, useState } from 'react';
import UploadCloudinary from './cloudinary/UploadCloudinary';
import createUser from './fauna/createUser';


function App() {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [generatedSignature, setGeneratedSignature] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    type: '',
    message: ''
  });
  const [formState, updateFormState] = useState({
    email: '',
    phoneNumber1: '',
    phoneNumber2: '',
    name: '',
    jobDesignation: '',
    department: '',

  });

  const handleFile = async e => {
    setUploadLoading(true);
    const file = e.target.files[0];

    if (!file.type.match('image.*')) {
      setAlertMessage({
        type: 'danger',
        message: 'Please upload an image file'
      });
      setUploadLoading(false);
      return;
    }
    if (file.size > 1000000) {
      setAlertMessage({
        type: 'danger',
        message: 'Image size should not exceed 1MB'
      });
      setUploadLoading(false);
      return;
    }
    const upload = await UploadCloudinary(file);
    setImage(upload.secure_url);
    setAlertMessage({
      type: 'success',
      message: 'Image uploaded successfully!'
    });
    setUploadLoading(false);
  }

  const chooseFile = useCallback(() => {
    const dropArea = document.querySelector(".drop_box");
    const button = dropArea.querySelector("button");
    const input = dropArea.querySelector("input");
    button.onclick();
    input.click();
  }, [])



  const updateForm = e => {
    const { value, name } = e.target;
    updateFormState({
      ...formState,
      [name]: value
    });
  };

  const generateSignature = async() => {

    if (!formState.name || !formState.jobDesignation || !formState.email || !formState.department || !formState.phoneNumber1) {
      setAlertMessage({
        type: 'danger',
        message: 'Please fill all fields'
      });
      return;
    }

    const adminEmail = formState.email;
    const adminEmailDomain = adminEmail.split('@')[1];
    // if (adminEmailDomain !== 'purple.xyz') {
    //   setAlertMessage({
    //     type: 'danger',
    //     message: 'Please enter an official email address'
    //   });
    //   return;
    // }

    setGeneratedSignature(true);

    const data = {
      ...formState,
      image
    }

    const createdProfile = await createUser(data);

    if (createdProfile === 'userExists') {
      alert('User with email already exists');
      return;
    }
  }

  const generateHtml = () => {
    highlightSignature();
    setAlertMessage({
      type: 'success',
      message: 'Signature copied to clipboard'
    });
  }

  setTimeout(() => {
    clearAlertMessage();
  }, 20000);

  const clearAlertMessage = () => {
    setAlertMessage({
      type: '',
      message: ''
    });
  }


  // highlight the signature preview
  const highlightSignature = () => {
    const signature = document.getElementById('signature');
    const range = document.createRange();
    range.selectNode(signature);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');
  }

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
      {alertMessage.message && <div className={`alert alert-${alertMessage.type}`} role="alert">
        {alertMessage.message}
      </div>}
      {!generatedSignature &&
        <div className='col-12 col-md-6 mx-auto card card-body'>
          <h5 className='text-center'>Purple money Signature Generator</h5>
          <div className="form-group">
            <label for="exampleInputEmail1">Name:</label>
            <input type="text" onChange={updateForm} value={formState.name} name='name' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="John Doe" />
          </div>

          <div className="form-group">
            <label for="exampleInputEmail1">Job Designation:</label>
            <input type="text" onChange={updateForm} value={formState.jobDesignation} name='jobDesignation' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Senior Advocate" />
          </div>

          <div className="form-group">
            <label for="exampleInputEmail1">Official Email address:</label>
            <input type="email" onChange={updateForm} value={formState.email} name='email' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="email@purple.xyz" />
          </div>

          <div className="form-group">
            <label for="exampleInputEmail1">Department:</label>
            <input type="text" onChange={updateForm} value={formState.department} name='department' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="E.G Technology" />
          </div>

          <div className="form-group">
            <label for="exampleInputPassword1">Phone Number:</label>
            <input type="text" onChange={updateForm} value={formState.phoneNumber1} name='phoneNumber1' className="form-control" id="exampleInputPassword1" placeholder="+234 0000001" />
          </div>

          {/* <div className="form-group">
            <label for="exampleInputPassword1">Phone Number 2:</label>
            <input type="text" onChange={updateForm} value={formState.phoneNumber2} name='phoneNumber2' className="form-control" id="exampleInputPassword1" placeholder="+234 0000002" />
          </div> */}

          <br />
          <span>Photo: <span className='text-warning'>Image should not exceed 1MB</span></span>
          {uploadLoading && <p className="text-success">Loading...</p>}
          {image ? <img width="10%" className="img-profile" src={image} alt="" /> : <img className="img-profile" src={formState.picture} width="10%" alt="" />
          }
          <div className="drop_box">
            {/* <label className="btn btn-sm btn-primary">Photo</label> */}
            <input name="file" type="file" onChange={handleFile} hidden accept='png, jpg' id="fileID" style={{ display: 'none' }} />
            <button onClick={chooseFile} disabled={uploadLoading && true} className="btn-sm btn-upload"><i className="fa fa-cloud-upload fa-3x" aria-hidden="true"></i></button>
          </div>

          <button onClick={() => generateSignature()} type="submit" className="btn btn-primary">Submit</button>

        </div>
      }

      <br />
      <br />
      {generatedSignature &&
        <>
        <div className='text-center'>
           <h5 className='text-center'>Purple Signature Generator</h5>
           <button onClick={() => setGeneratedSignature(false)} type="submit" className="btn btn-primary" style={{marginRight: '10px'}}>Try Again</button>
           {/* generate */}
            <button onClick={() => generateHtml()} type="submit" className="btn btn-primary">Copy</button>
           </div>
           <br />
           <br />
           <br />
          <div id="signature" className='signature mx-auto'>
            <div id="logo">
              <img alt='' src={image} width={'200px'} />
            </div>
            <div id="content">
              <p id="title">{formState?.name}</p>
              {/* <p id="subtitle">{formState?.jobDesignation}</p> */}
              <p id="subtitle">{formState?.jobDesignation}, {formState?.department} | Purple Group Plc</p>
              <p id="contact">
                <span>
                  <a href={`mailto:${formState?.email}`}>{formState?.email}</a>
                </span>
              </p>
              <p id="contact">
                <span>
                  {/* <i className="fa fa-phone" style={{ marginRight: '10px' }}></i> */}
                  {/* tel */}
                  <a href={`tel:${formState?.phoneNumber1}`}>{formState?.phoneNumber1}</a>
                   <span style={{ marginLeft: '5px' , marginRight: '5px', color: 'purple'}}>|</span>
                  <a href={`tel:012914764`}>012914764</a>
                </span>
              </p>
              <p id="contact">
                <span>
                  {/* <i className="fa fa-globe" style={{ marginRight: '10px' }}></i> */}
                  <a target={'_blank'} rel="noreferrer" href='https://purplemoneyng.com/'>https://purplemoneyng.com/</a>
                </span>

              </p>
              <p id="contact">
                <span>
                  {/* <i className="fa fa-map-marker" style={{ marginRight: '12px' }}></i> */}
                  <a target={'_blank'} rel="noreferrer" href='https://goo.gl/maps/jeEZhbaYWP5Gh3tP6'>Plot 15, New Oniru Market Road, Oniru Estate, Victoria Island, Lagos.</a>
                </span>

              </p>
              <p id="social-icons">
                <a target={'_blank'} rel="noreferrer" href="https://twitter.com/purplemoneyM" alt="Twitter">
                <img alt='' width={'70%'} src='https://ucarecdn.com/e29dbbf4-6990-4d35-997f-a0f51700fe37/Vector1.png' />

                </a>
                <a target={'_blank'} rel="noreferrer" href="	https://web.facebook.com/purplemoneybank" title='Facebook'>
                <img alt='' width={'70%'} src='https://ucarecdn.com/b9c4e4c7-2bc3-4fe8-bb50-0f01f764a938/Vector.png' />

                </a>
                <a target={'_blank'} rel="noreferrer" href="https://www.instagram.com/purplemoneymfb/">
                <img alt='' width={'70%'} src='https://ucarecdn.com/b3f48680-0e4e-41cd-9441-fb9e320595f8/simpleicons_instagram.png' />

                </a>
                <img alt='' width={'50px'} src='https://invest.purple.xyz/assets/img/logos/purple.png' />
              </p>
              
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div className='confidential'>
                <p id="confidential">This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error please notify the system manager. This footnote also confirms that this email message has been swept for the presence of computer viruses.</p>
            </div>
          </div>
        </>
      }
      <div>
      </div>
    </div>
  );
}

export default App;

