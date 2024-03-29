import React, {Component, useState, useEffect } from 'react';
import {useDropzone} from 'react-dropzone'
import { useRouteMatch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {userService} from '../../services/user.service'

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

const UserEdit = () => {
    let { path, url } = useRouteMatch();

    const [files, setFiles] = useState([]);
    const [user, setUser] = useState([])
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [confirmNewPw, setConfirmNewPw] = useState('')
    const [isChangingPass, setIsChangingPass] = useState(false)

    const [isValidateError, setValidateError] = useState(false)
    const [validatorMes, setValidatorMes] = useState([])

    const showChangePw = () => {
        setIsChangingPass(true)
    }
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 1) {
                toast.error("Chỉ thêm 1 ảnh");
                setValidateError(true);
            }
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const postData = event => {

        let flagPass = false
        if (isChangingPass) {
            let data = {
                name: name,
                email: email,
                password: pw,
                new_password: newPw,
                new_cf_password: confirmNewPw,
            }

            if (confirmNewPw != newPw) {
                toast.error("Nhập lại mật khẩu không đúng");
            }
            userService.updatePassword(data).then((response) => {
                if (response.data.status === false) {
                    toast.warning("Lưu mật khẩu mới thất bại");
                } else {
                    toast.success("Lưu mật khẩu mới thành công");
                    setValidateError(false);
                    setIsChangingPass(false)
                    flagPass = true;
                }
    
            }).catch(error => {
                setValidateError(true);
                let errorData = error.response.data;
                toast.error(errorData.message);
                setValidatorMes(errorData.data)
            
            })
        } else {
            flagPass = true
        }

        if (flagPass) {

            let formData = new FormData();
    
            files.map(file => {
                formData.append('file[]', file)            
            })
            formData.append('name', name)            
            formData.append('email', email)            
            formData.append('phone', phone)            
    
            userService.updateInfo(formData).then((response) => {
                if (response.data.status === false) {
                    toast.warning("Thay đổi thông tin thất bại");
                } else {
                    toast.success("Cập nhật thông tin thành công");
                    setValidateError(false);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
    
                }
    
            }).catch(error => {
                setValidateError(true);
                let errorData = error.response.data;
                toast.error(errorData.message);
                setValidatorMes(errorData.data)
            
            })
    
        }
    }

    useEffect(() => {
        let userInfo = JSON.parse(localStorage.getItem('user'));
        setUser(userInfo);
        if (userInfo != null) {
            setName(userInfo['name']);
            setEmail(userInfo['email']);
            setPhone(userInfo['phone']);
        }

    }, [])

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                src={file.preview}
                style={img}
                />
            </div>
        </div>
    ));
    return (
        <div className="edit_user_info">
                <h4 className="mb-4">Cài đặt thông tin chung</h4>
                <div className="input-info">
                <div className="position-relative wrap-box">
                    <div className="box box_full">
                        <input type="text" value={email} disabled className="input-name-email" placeholder="Email" />
                    </div>
                    <div className="box">
                        <input type="text" value={name} onChange={event => setName(event.target.value)} className="input-name-address" placeholder="Tên" />
                        <span className={"validator_error " + (isValidateError && validatorMes.name ? 'visible' : 'invisible')}>*{validatorMes.name}</span>
                    </div>
                
                    <div className="box">
                        <input type="text" value={phone} onChange={event => setPhone(event.target.value)} className="input-name-address" placeholder="Số điện thoại" />
                        {/* <span className={"validator_error " + (isValidateError && validatorMes.phone ? 'visible' : 'invisible')}>*{validatorMes.name}</span> */}
                    </div>
                
                </div>
                <button onClick={showChangePw} className="cs_main_button change_pass my-3">Đổi mật khẩu</button>
                <div className={"position-relative my-3 wrap-box " + (isChangingPass ? "d-flex" : "d-none") }>
                    <div className="box">
                        <input type="password" value={pw} onChange={event => setPw(event.target.value)} className="input-name-address" placeholder="Mật khẩu hiện tại" />
                        <span className={"validator_error " + (isValidateError && validatorMes.password ? 'visible' : 'invisible')}>*{validatorMes.password}</span>
                    </div>
                    <div className="box">
                        <input type="password" value={newPw} onChange={event => setNewPw(event.target.value)} className="input-name-address" placeholder="Mật khẩu mới" />
                        <span className={"validator_error " + (isValidateError && validatorMes.new_password ? 'visible' : 'invisible')}>*{validatorMes.new_password}</span>
                    </div>
                    <div className="box">
                        <input type="password" value={confirmNewPw} onChange={event => setConfirmNewPw(event.target.value)} className="input-name-address" placeholder="Nhập lại mật khẩu mới" />
                        <span className={"validator_error " + (isValidateError && validatorMes.new_cf_password ? 'visible' : 'invisible')}>*{validatorMes.new_cf_password}</span>
                    </div>
                </div>
                <div className="position-relative">
                    <div className="box">
                    <label htmlFor="" className="d-block">Ảnh cá nhân</label>
                    <div {...getRootProps({className: 'dropzone'})}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop a file here, or click to select files</p>
                    </div>
                    <aside style={thumbsContainer}>
                        {thumbs}
                    </aside>
                    </div>
                
                </div>
                    
                <button onClick={postData} className="cs_main_button mt-3">Lưu</button>
            </div>
            </div>
        );
    };

export default UserEdit;