import AxiosClient from '../../client/AxiosClient';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getToken } from '../../services/LocalStorage';

function InteractPost(props) {
  const userToken = getToken('sessionToken');

  const modifyPost = async () => {};

  const deletePost = async () => {
    const confirmation = window.confirm(
      'Voulez-vous supprimer définitivement ce post?'
    );
    if (confirmation) {
      await AxiosClient({
        method: 'delete',
        url: `api/posts/${props.id}`,
        headers: { Authorization: 'Bearer ' + userToken },
      });
      document.location.reload();
      toast.success(`Message supprimé!`, {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="Interacting__post">
        <div onClick={modifyPost}>
          <i className="fa-solid fa-pencil Modifying__post-icon"></i>
        </div>
        <div onClick={deletePost}>
          <i className="fa-solid fa-trash Deleting__post-icon"></i>
        </div>
      </div>
    </>
  );
}

export default InteractPost;
