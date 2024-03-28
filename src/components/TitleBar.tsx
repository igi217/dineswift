import Logo from "../assets/images/logo-white.png"
import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from "react";
import { platform } from '@tauri-apps/api/os';

export default function TitleBar() {
    const [platformName, setPlatformName] = useState<string | null>(null);


    useEffect(() => {
        platform().then((val) => {
            setPlatformName(val)
        })
    }, [])

    if(!platformName) return null;


    return (
        platformName === 'darwin' ? (
            <MacOsTitleBar />
        ) : (
            <WindowsTitleBar/>
        )
    )
}
export function MacOsTitleBar() {

    const [maximized, setMaximized] = useState(false)

    useEffect(() => {
        appWindow.onResized(() => {
            appWindow.isMaximized().then((val) => setMaximized(val))
        })
    }, [])
    return (
        <div data-tauri-drag-region className="macos-title">
            <div className="macos-tool">
                <span
                    className="close"
                    onClick={() => appWindow.close()}>

                </span>
                <span
                    className={`minimize ${maximized ? 'disabled' : ""}`}
                    onClick={() => appWindow.minimize()}>

                </span>
                <span
                    className="fullscreen"
                    onClick={() => appWindow.toggleMaximize()}>

                </span>
            </div>

            <div className="title-wrap">
                <img src={Logo} alt="Logo" />
                <span>DINESWIFT</span>
            </div>
        </div>
    )
}

export function WindowsTitleBar() {
    const [maximized, setMaximized] = useState(false)

    useEffect(() => {
        appWindow.onResized(() => {
            appWindow.isMaximized().then((val) => setMaximized(val))
        })
    }, [])
    return (
        <div data-tauri-drag-region className="windows-title">
            <div className="title-wrap">
                <img src={Logo} alt="Logo" />
                <span>DINESWIFT</span>
            </div>

            <div className="windows-tool">
                <span
                    className={`minimize ${maximized ? 'disabled' : ""}`}
                    onClick={() => appWindow.minimize()}>
                    <i className="fa-light fa-dash"></i>
                </span>
                <span
                    className="fullscreen"
                    onClick={() => appWindow.toggleMaximize()}>
                    {
                        maximized ? (
                            <i className="fa-light fa-window-restore"></i>
                        ) : (
                            <i className="fa-light fa-square"></i>
                        )
                    }
                </span>
                <span
                    className="close"
                    onClick={() => appWindow.close()}>
                    <i className="fa-light fa-xmark"></i>
                </span>


            </div>
        </div>
    )
}