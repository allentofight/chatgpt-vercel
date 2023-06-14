import '../../styles/pageNav.css';
import { createSignal, Show } from 'solid-js';

export default function ImageViewer(props: {
  imageUrl: string,
  closeDialog: () => void
}) {

  const [scale, setScale] = createSignal(1);
  const [isMaxSize, setIsMaxSize] = createSignal(false);
  const [rotate, setRotate] = createSignal(0);

  const zoomIn = () => {
    let newScale = scale() / 1.2;
    // Ensure scale doesn't go below the minimum
    newScale = Math.max(newScale, 0.194);
    setScale(newScale);
  };

  const zoomOut = () => {
    let newScale = scale() * 1.2;
    // Ensure scale doesn't go below the minimum
    newScale = Math.min(newScale, 7.454);
    setScale(newScale);
  };


  const rotateCounterClockwise = () => {
    setRotate(rotate() - 90);
  }

  const rotateClockwise = () => {
    setRotate(rotate() + 90);
  }

  return (
    <>
      <style>
        {`
          .el-image-viewer__wrapper {
            position: fixed;
            inset: 0;
          }
          
          
          .el-image-viewer__mask {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              opacity: .5;
              background: #000;
          }
          
          .el-image-viewer__close {
              width: 44px;
              height: 44px;
              top: 40px;
              right: 40px;
              font-size: 24px;
              color: #fff;
              background-color: #606266;
              border-color: #fff;
          }
          
          .el-image-viewer__actions {
              left: 50%;
              bottom: 30px;
              transform: translate(-50%);
              width: 282px;
              height: 44px;
              padding: 0 23px;
              background-color: #606266;
              border-color: #fff;
              border-radius: 22px !important;
          }

          .el-image-viewer__btn {
            position: absolute;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            opacity: .8;
            cursor: pointer;
            box-sizing: border-box;
            -webkit-user-select: none;
            user-select: none;
          }
          
          .el-icon {
              height: 1em;
              width: 1em;
              line-height: 1em;
              display: inline-flex;
              justify-content: center;
              align-items: center;
              position: relative;
              font-size: inherit;
          }
          
          
          .el-image-viewer__actions__inner {
              width: 100%;
              height: 100%;
              text-align: justify;
              cursor: default;
              font-size: 23px;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: space-around;
          }
          
          .el-image-viewer__canvas {
              position: static;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              -webkit-user-select: none;
              user-select: none;
          }
      `}
      </style>
      <div tabindex="-1" class="el-image-viewer__wrapper" style="z-index: 2003;">
        <div class="el-image-viewer__mask"></div>
        <span class="el-image-viewer__btn el-image-viewer__close" onClick={props.closeDialog}><i class="el-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path>
          </svg></i></span>
        <div class="el-image-viewer__btn el-image-viewer__actions">
          <div class="el-image-viewer__actions__inner">
            <i class="el-icon" onClick={() => {
              zoomIn()
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path fill="currentColor" d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704zM352 448h256a32 32 0 0 1 0 64H352a32 32 0 0 1 0-64z"></path>
              </svg></i>
            <i class="el-icon" onClick={() => {
              zoomOut()
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path fill="currentColor" d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704zm-32-384v-96a32 32 0 0 1 64 0v96h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96z"></path>
              </svg></i>
            <i class="el-image-viewer__actions__divider"></i>
            <i class="el-icon" onClick={() => {
              setIsMaxSize(!isMaxSize());
            }}>
              <Show when={!isMaxSize()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                  <path fill="currentColor" d="m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64v.064zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64l-192 .192zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64v-.064z"></path>
                </svg>
              </Show>
              <Show when={isMaxSize()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M813.176 180.706a60.235 60.235 0 0 1 60.236 60.235v481.883a60.235 60.235 0 0 1-60.236 60.235H210.824a60.235 60.235 0 0 1-60.236-60.235V240.94a60.235 60.235 0 0 1 60.236-60.235h602.352zm0-60.235H210.824A120.47 120.47 0 0 0 90.353 240.94v481.883a120.47 120.47 0 0 0 120.47 120.47h602.353a120.47 120.47 0 0 0 120.471-120.47V240.94a120.47 120.47 0 0 0-120.47-120.47zm-120.47 180.705a30.118 30.118 0 0 0-30.118 30.118v301.177a30.118 30.118 0 0 0 60.236 0V331.294a30.118 30.118 0 0 0-30.118-30.118zm-361.412 0a30.118 30.118 0 0 0-30.118 30.118v301.177a30.118 30.118 0 1 0 60.236 0V331.294a30.118 30.118 0 0 0-30.118-30.118zM512 361.412a30.118 30.118 0 0 0-30.118 30.117v30.118a30.118 30.118 0 0 0 60.236 0V391.53A30.118 30.118 0 0 0 512 361.412zM512 512a30.118 30.118 0 0 0-30.118 30.118v30.117a30.118 30.118 0 0 0 60.236 0v-30.117A30.118 30.118 0 0 0 512 512z"></path></svg>
              </Show>
            </i>
            <i class="el-image-viewer__actions__divider"></i>
            <i class="el-icon" onClick={() => {
              rotateCounterClockwise()
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path fill="currentColor" d="M289.088 296.704h92.992a32 32 0 0 1 0 64H232.96a32 32 0 0 1-32-32V179.712a32 32 0 0 1 64 0v50.56a384 384 0 0 1 643.84 282.88 384 384 0 0 1-383.936 384 384 384 0 0 1-384-384h64a320 320 0 1 0 640 0 320 320 0 0 0-555.712-216.448z"></path>
              </svg></i>
            <i class="el-icon" onClick={() => {
              rotateClockwise()
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path fill="currentColor" d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"></path>
              </svg></i>
          </div>
        </div>
        <div class="el-image-viewer__canvas">
          <img src={props.imageUrl} class="el-image-viewer__img" style={`transform: scale(${scale()}) rotate(${rotate()}deg) translate(0px, 0px); transition: transform 0.3s ease 0s; ${isMaxSize() ? '' : 'max-height: 100%; max-width: 100%;'}`}

          />
        </div>
      </div>
    </>
  )
}