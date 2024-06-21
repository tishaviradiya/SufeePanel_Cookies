const path=require('path');
const fs=require('fs');
const nodemailer=require('nodemailer');
const Admin=require('../models/adminModel');
module.exports.dashboard=async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/admin');
    }
    return res.render('dashboard',{
        adminData:req.cookies.admin,
    });
}
module.exports.addAdmin=async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/admin');
    }
    return res.render('addAdmin',{
        adminData:req.cookies.admin,
    });
}
module.exports.adminAddData=async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    try{   
    var img='';
    if(req.file){
        img=Admin.iPath+'/'+req.file.filename;
    } 
    req.body.name=req.body.fname+' '+req.body.lname;
    req.body.image=img;
   let addData= await Admin.create(req.body);
   if(addData){
        console.log('Data is Inserted!');    
        return res.redirect('/admin/addAdmin');
   }
   else{
        console.log('Something is wrong !');
        return res.redirect('back');
   }
    }
    catch(err){
        console.log('Something is Wrong !');
        return res.redirect('back');
    }
}
module.exports.viewAdmin=async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/admin');
    }
    let displayData=await Admin.find();
    return res.render('viewAdmin',{
        showData:displayData,
        adminData:req.cookies.admin,
    });
}
module.exports.deleteAdmin=async(req,res)=>{
    try{
        let findData=await Admin.findById(req.params.id);
        if(findData){
            let imageP=path.join(__dirname,'..',findData.image);
            await fs.unlinkSync(imageP);
        }
        let deleteAdmin=await Admin.findByIdAndDelete(req.params.id);
        if(deleteAdmin){
            console.log('Data has been Deleted !');
            return res.redirect('back');
        }
        else{
            console.log('Something is wrong !');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.updateAdmin=async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/admin');
    }
    let updateData=await Admin.findById(req.query.id);
    return res.render('updateAdmin',{
        updateRecord:updateData,
        adminData:req.cookies.admin,
    });
}
module.exports.updateAdminRecord=async(req,res)=>{
    try{
        if(req.file){
            let findData=await Admin.findById(req.params.id);
            if(findData){
                let imageP=path.join(__dirname,'..',findData.image);
                await fs.unlinkSync(imageP);
            }
            var img='';
            req.body.image=Admin.iPath+'/'+req.file.filename;
        }
        else{
            let findData=await Admin.findById(req.params.id);
            if(findData){
                req.body.image=findData.image;
            }
        }
        req.body.name=req.body.fname+' '+req.body.lname;
        let updateData=await Admin.findByIdAndUpdate(req.params.id,req.body);
        if(updateData){
            console.log(updateData);
             return res.redirect('/admin/viewAdmin');
        }
        else{
            console.log('Data is not Updated !');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.login=async(req,res)=>{
    return res.render('login');
}
module.exports.signIn=async(req,res)=>{
    try{
        let checkEmail=await Admin.findOne({email:req.body.email});
        if(checkEmail){
            if(checkEmail.password==req.body.password){
                res.cookie('admin',checkEmail);
                return res.redirect('/admin/dashboard');
            }
            else{
                console.log('Invalid Password!');
                return res.redirect('back');
            }
        }
        else{
            console.log('Invalid Email !');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Something is wrong !');
        return res.redirect('back');
    }
}
module.exports.profile=async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/admin');
    }
    return res.render('profile',{
            adminData:req.cookies.admin,
        
    });
}
module.exports.editAdmin=async(req,res)=>{
    if(req.cookies.admin==undefined){
        return res.redirect('/admin');
    }
    return res.render('editProfile',{
        adminData:req.cookies.admin,
    });
}
module.exports.editProfileData=async(req,res)=>{
    try{
        if(req.file){
          let findData=await Admin.findById(req.params.id);
          if(findData){
            let imageP=path.join(__dirname,'..',findData.image);
            await fs.unlinkSync(imageP);
          }
          var img='';
          req.body.image=Admin.iPath+'/'+req.file.filename; 
          
        }
        else{
            let findData=await Admin.findById(req.params.id);
            if(findData){
                req.body.image=findData.image;
            }
            req.body.image=req.body.fname+' '+req.body.lname;
            await Admin.findByIdAndUpdate(req.params.id,req.body);
            return res.redirect('/admin/viewAdmin');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.password=async(req,res)=>{
    return res.render('password');
}
module.exports.changePassword=async(req,res)=>{
    try{
        
            let dbPass=req.cookies.admin.password;
            if(dbPass==req.body.cPass){
                if(req.body.cPass!=req.body.newPass){
                    if(req.body.newPass==req.body.conPass){
                        await Admin.findByIdAndUpdate(req.cookies.admin._id,{
                            password:req.body.newPass,
                        });
                        return res.redirect('/admin/logout');
                    }
                    else{
                        console.log('New password and Confirm password are not Same!');
                        return res.redirect('back');
                    }
                }
                else{
                    console.log('Current password and New Password are Same!');
                    return res.redirect('back');
                }
            }
            else{
                console.log('Current Password is Invalid!');
                return res.redirect('back');
            }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
// forgetPass
module.exports.forgetPass=async(req,res)=>{
    return res.render('forgetPass');
}
module.exports.checkEmailForget=async(req,res)=>{
    try{
        let checkEmail=await Admin.findOne({email:req.body.email});
        if(checkEmail){
            var otp=Math.round(Math.random()*1000000);
            res.cookie('otp',otp);
            var msg=`Your OTP is Here${otp}`
            res.cookie('email',req.body.email);
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                  user: "tishaviradiya@gmail.com",
                  pass: "wckhvillclctkhxn",
                },
              });
              const info = await transporter.sendMail({
                from: '"Fred Foo 👻" <tishaviradiya@gmail.com>', // sender address
                to: "tishaviradiya@gmail.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: msg, // html body
              });
              return res.redirect('/admin/otpPage');
        }
        else{
            console.log('Invalid Email!');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.otpPage=async(req,res)=>{
    return res.render('otpPage');
}
module.exports.verifyOtp=async(req,res)=>{
    try{
        if(req.body.otp==req.cookies.otp){
            return res.redirect('/admin/adminChangePass');
        }
        else{
            console.log('OTP not match!');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.adminChangePass=async(req,res)=>{
    return res.render('adminChangePass');
}
module.exports.resetPass=async(req,res)=>{
    try{
        if(req.body.newPass==req.body.conPass){
            var email=req.cookies.email;
            let checkEmail=await Admin.findOne({email:email});
            if(checkEmail){
                let changePass=await Admin.findByIdAndUpdate(checkEmail.id,{
                    password:req.body.newPass,
                });
                if(changePass){
                    res.clearCookie('email');
                    res.clearCookie('otp');
                    return res.redirect('/admin');
                }
            }
            else{
                console.log('Invalid Email!');
                return res.redirect('back');
            }
        }
        else{
            console.log('New Password and Confirm Password are not Same!');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}