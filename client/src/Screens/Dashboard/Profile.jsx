import React, { useEffect, useState } from 'react'
import SideBar from './SideBar'
import Uploader from '../../Components/Uploader'
import { Input } from '../../Components/UsedInput'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ProfileValidation } from '../../Components/Validation/UserValidation'
import { InlineError } from '../../Notifications/Error'
import { Imagepreview } from '../../Components/Imagepreview'
import { deleteProfileAction, updateProfileAction } from '../../Redux/Actions/userActions'

function Profile() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  const [imageUrl, setImageUrl] = useState(userInfo ? userInfo.image : "");
  const { isLoading, isError, isSuccess } = useSelector(
    (state) => state.userUpdateProfile
  )
  const {
    isLoading: deleteLoading,
    isError: deleteError
  } = useSelector(
    (state) => state.userDeleteProfile
  )

  // validate user
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ProfileValidation)
  })

  //onSubmit update profile
  const onSubmit = (data) => {
    dispatch(updateProfileAction({ ...data, image: imageUrl }));
  }

  // delete profile
  const deleteProfile = () => {
    window.confirm("Are you sure to delete your profile?") &&
      dispatch(deleteProfileAction());
  }
  useEffect(() => {
    if (userInfo) {
      setValue("fullName", userInfo?.fullName);
      setValue("email", userInfo?.email);
    }
    if (isSuccess) {
      dispatch({ type: "USER_UPDATE_PROFILE_RESET" });
    }
    if (isError || deleteError) {
      toast.error(isError || deleteError);
      dispatch({ type: "USER_UPDATE_PROFILE_RESET" });
      dispatch({ type: "USER_DELETE_PROFILE_RESET" });
    }
  }, [userInfo, setValue, isError, isSuccess, dispatch, deleteError]);


  return (
    <SideBar>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6'>
        <h2 className='text-xl font-bold'>Profile</h2>
        <div className='w-full grid lg:grid-cols-12 gap-6'>
          <div className='col-span-10'>
            <Uploader setImageUrl={setImageUrl} />
          </div>
          {/* image preview for user */}
          <div className='col-span-2'>
            <Imagepreview
              image={imageUrl}
              name={userInfo ? userInfo.fullName : "Netflixo"}
            />
          </div>
        </div>

        <div className="w-full">
          <Input
            label="FullName"
            placeholder="Metflixo"
            type="text"
            bg={true}
            name="fullName"
            register={register("fullName")}
          />
          {errors.fullName && <InlineError text={errors.email.message} />}
        </div>
        <div className="w-full">
          <Input
            label="Email"
            placeholder="netflixo@gmail.com"
            type="email"
            name="email"
            register={register("email")}
            bg={true}
          />
          {errors.email && <InlineError text={errors.email.message} />}
        </div>
        <div className='flex gap-2 flex-wrap flex-col-reverse justify-center sm:flex-row  items-center my-4'>
          <button
            onClick={deleteProfile}
            disabled={deleteLoading || isLoading}
            className='bg-subMain font-medium transition border border-subMain hover:bg-main text-white py-3 px-6 rounded w-full sm:w-auto'>
            {
              isLoading ? "Deleting ..." : "Delete Account"
            }
          </button>
          <button
            disabled={deleteLoading || isLoading}
            className='bg-main  font-medium transition border border-subMain hover:bg-subMain text-white py-3 px-6 rounded w-full sm:w-auto'>
            {
              isLoading ? "Updating ..." : "Update Profile"
            }
          </button>
        </div>
      </form>
    </SideBar>
  )
}

export default Profile