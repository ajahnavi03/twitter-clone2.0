import * as React from 'react';
import './EditProfile.css';
import { Button, Modal, TextField } from '@mui/material';
import { Box } from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 8,
};

function EditChild({ dob, setDob }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div className='birthdate-section' onClick={handleOpen}>
        <text>Edit</text>
      </div>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...style, width: 300, height: 400 }}>
          <div className='text'>
            <h2>Edit date of birth?</h2>
            <p>
              This can only be changed a few times.
              <br />
              Make sure you enter the age of the <br />
              person using the account.
            </p>
            <input
              type='date'
              onChange={(e) => setDob(e.target.value)}
              value={dob}
            />
            <Button className='e-button' onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function EditProfile({ user, loggedInUser }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [dob, setDob] = React.useState('');

  const handleSave = () => {
    const editedInfo = {
      name,
      bio,
      location,
      website,
      dob,
    };
    axios
      .patch(`https://twitter-clone2-0-hfe5.onrender.com/userUpdates/${user?.email}`, editedInfo)
      .then(() => {
        setOpen(false);
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  return (
    <div>
      <button className='Edit-profile-btn' onClick={() => setOpen(true)}>
        Edit Profile
      </button>

      <Modal
        open={open}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style} className='modal'>
          <div className='header'>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
            <h2 className='header-title'>Edit Profile</h2>
            <button className='save-btn' onClick={handleSave}>
              Save
            </button>
          </div>
          <form className='fill-content'>
            <TextField
              className='text-field'
              fullWidth
              label='Name'
              id='fullWidth'
              variant='filled'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <TextField
              className='text-field'
              fullWidth
              label='Bio'
              id='fullWidth'
              variant='filled'
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />
            <TextField
              className='text-field'
              fullWidth
              label='Location'
              id='fullWidth'
              variant='filled'
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
            <TextField
              className='text-field'
              fullWidth
              label='Website'
              id='fullWidth'
              variant='filled'
              onChange={(e) => setWebsite(e.target.value)}
              value={website}
            />
          </form>
          <div className='birthdate-section'>
            <p>Birth Date</p>
            <p>.</p>
            <EditChild dob={dob} setDob={setDob} />
          </div>
          <div className='last-section'>
            {loggedInUser[0]?.dob ? (
              <h2>{loggedInUser[0]?.dob}</h2>
            ) : (
              <h2>{dob ? dob : 'Add your date of birth'}</h2>
            )}
            <div className='last-btn'>
              <h2>Switch to professional</h2>
              <ChevronRightIcon />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
