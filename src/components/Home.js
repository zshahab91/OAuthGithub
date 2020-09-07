import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Styled from "styled-components";
import { AuthContext } from "../App";


export default function Home() {
  const { state, dispatch } = useContext(AuthContext);
  console.log("state is:", state)
  const [ repos, setRepos ] = useState([]);
  const [ commits, setCommits ] = useState([]);


  if (!state.isLoggedIn || !state.user.name) {
    return <Redirect to="/login" />;
  }

  const { avatar_url, name, public_repos, followers, following, login } = state.user
  const getRepos = () => {
    const proxy_url_token = state.proxy_url_token
    fetch(proxy_url_token)
      .then(response => response.json())
      .then(res => {
        const url = `https://api.github.com/users/${login}/repos`;
        localStorage.setItem('token', res.token)
        const headers = {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": `token ${res.token}`
        }
        fetch(url, {
          "method": "GET",
          "headers": headers
        })
          .then((res) => res.json())
          .then(response => {
            const resultGetAllRpos = response;
            localStorage.setItem('allRepos', JSON.stringify(resultGetAllRpos))
            setRepos(resultGetAllRpos)
          })

      })
  }
  const getCommits = (nameRepo) => {
    const url = `https://api.github.com/repos/${login}/${nameRepo}/commits`;

    const headers = {
      "Accept": "application/vnd.github.v3+json",
      "Authorization": `token ${localStorage.getItem('token')}`
    }
    fetch(url, {
      "method": "GET",
      "headers": headers
    })
      .then((res) => res.json())
      .then(response => {
        const resultGetAllCommit = response;
        localStorage.setItem('allCommits', JSON.stringify(resultGetAllCommit))
        setCommits(resultGetAllCommit)
      })
  }

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT"
    });
  }



  return (
    <Wrapper>
      <div className="container">
        <button onClick={() => handleLogout()}>Logout</button>
        <div className="info">
          <div><img src={avatar_url} /></div>

          <div>
            <p>{name}</p>
            <p>{`${public_repos}  Repos`}</p>
            <p>{`${followers}  Followers`}</p>
            <p>{`${following}  Following`}</p>
            <button onClick={getRepos}>get Repo</button>
          </div>

        </div>
        <div className="main-content">
          {repos.length !== 0 && <div className="content">

            <h3>All repos :</h3>
            {
              <ol>
                {
                  repos.map((repo, inx) => {
                    return <li>
                      <a key={inx} onClick={() => getCommits(repo.full_name.split('/')[ 1 ])}>{repo.full_name.split('/')[ 1 ]}</a>
                    </li>
                  })}

              </ol>
            }
          </div>}
          {commits.length !== 0 && <div className="content">

            <h3>All commits of repo :</h3>
            {
              <ol>
                {commits.map((item, inx) => {
                  return <li>
                    <a key={inx} href={item.url} target="_blank">{item.commit.message}</a>
                  </li>
                })}

              </ol>
            }

          </div>}

        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = Styled.section`
.container{
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial;
  position: relative;
  padding:50px;
  overflow: hidden;
  .info{
    position: absolute;
    left:0;
    top: 0;
    height: 100px;
    padding: 5px;
    width:300px;

  }
  .main-content{
    display: flex;
    flex-direction: row;
  }
  button{
    all: unset;
    width: 100px;
    height: 35px;
    margin: 10px 10px 0 0;
    align-self: flex-end;
    background-color: #0041C2;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #0041C2;
    cursor: pointer;

    &:hover{
      background-color: #fff;
      color: #0041C2;
    }
  }

  >div{
    height: 100%;
    width: 100%;
    display: block;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    li{
      margin: 10px;
    }
    a{
      cursor: pointer;
      color: inherit;
      text-decoration: none;
      margin: 5px;
    }
    a:hover{
      color: gray;
    }
    .content{
      padding: 20px 100px;    
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      width: 500px;
      height: 400px;
      margin: 50px 5px;
      overflow-y: scroll;
      overflow-x: hidden;
  
    }
  
      img{
        height: 80px;
        width: 80px;
        border-radius: 50%;
        float: left;
        margin: 15px;
      }
  
      >span:nth-child(2){
        margin-top: 20px;
        font-weight: bold;
      }
  
      >span:not(:nth-child(2)){
        margin-top: 8px;
        font-size: 14px;
      }
  
    }

  }
}
`;
