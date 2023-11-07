import '../../styles/pageNav.css';
import { createSignal, Show } from 'solid-js';
import { Spinner, SpinnerType } from 'solid-spinner';

export default function ImageViewer(props: {
  imageUrl: string,
  closeDialog: () => void
}) {

  const [scale, setScale] = createSignal(1);
  const [isMaxSize, setIsMaxSize] = createSignal(false);
  const [rotate, setRotate] = createSignal(0);
  let [isLoading, setIsLoading] = createSignal(true);

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
              font-size: 24px;
              margin: 10px 0 0 10px;
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


          .el-image-viewer-close__btn, .el-image-viewer__btn {
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
        <div class="el-image-viewer__btn el-image-viewer__actions">
          <div class="el-image-viewer__actions__inner">
            <i class="el-icon" onClick={() => {
              zoomIn()
            }}>
              <img class="w-full" src="/svg/zoom-in.svg" /></i>
            <i class="el-icon" onClick={() => {
              zoomOut()
            }}>
              <img class="w-full" src="/svg/zoom-out.svg" /></i>
            <i class="el-image-viewer__actions__divider"></i>
            <i class="el-icon" onClick={() => {
              setIsMaxSize(!isMaxSize());
            }}>
              <Show when={!isMaxSize()}>
                <img class="w-full" src="/svg/normal-zoom.svg" />
              </Show>
              <Show when={isMaxSize()}>
                <img class="w-full" src="/svg/scale-zoom.svg" />
              </Show>
            </i>
            <i class="el-image-viewer__actions__divider"></i>
            <i class="el-icon" onClick={() => {
              rotateCounterClockwise()
            }}>
              <img class="w-full" src="/svg/rotate-left.svg" /></i>
            <i class="el-icon" onClick={() => {
              rotateClockwise()
            }}>
              <img class="w-full" src="/svg/rotate-right.svg" /></i>
          </div>
        </div>
        <div class="el-image-viewer__canvas">
          <div class="flex h-full">
            <img src={props.imageUrl}
              class="el-image-viewer__img"
              onLoad={() => setIsLoading(false)}
              style={`transform: scale(${scale()}) rotate(${rotate()}deg) translate(0px, 0px); transition: transform 0.3s ease 0s; ${isMaxSize() ? '' : 'max-height: 100%; max-width: 100%;'}`} />
            <span class="el-image-viewer-close__btn el-image-viewer__close" onClick={props.closeDialog}><i class="el-icon">
              <img class="w-full" src="/svg/close.svg" /></i></span>
          </div>

          <Show when={isLoading()}>
            <Spinner class="w-1/3 absolute" type={SpinnerType.tailSpin} width="20%" height="20%" color="#bd69ff" />
          </Show>
        </div>
      </div>
    </>
  )
}