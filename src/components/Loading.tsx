import { SpinnerCircular } from "spinners-react";

interface Loading {
    show?: boolean;
}
export default function Loading(props: Loading) {
    const className = props.show ? 'pointer-events-auto opacity-100' : ''
    return (
        <div className={`fixed pointer-events-none opacity-0 transition-opacity justify-center items-center flex backdrop-blur-lg inset-0 bg-[rgba(255,255,255,0.2)] z-10 ${className}`}>
            <SpinnerCircular size={90} thickness={69} speed={140} color="hsl(263.4 70% 50.4%)" secondaryColor="rgba(0, 0, 0, 0.14)" />
        </div>
    )
}