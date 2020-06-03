import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSpring, a, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import "./index.css";

function ModalPortal({ children, selector }) {
    const ref = useRef();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        ref.current = document.querySelector(selector);
        setMounted(true);
    }, [selector]);

    return mounted ? createPortal(children, ref.current) : null;
}

function BottomSheetWrapper({
    isBottomSheetVisible,
    closeBottomSheet,
    children,
}) {
    const height = 350;
    const draggingRef = useRef(false);
    const [{ y }, set] = useSpring(() => ({ y: height }));

    const open = ({ canceled }) => {
        // when cancel is true, it means that the user passed the upwards threshold
        // so we change the spring config to create a nice wobbly effect
        set({ y: 0, config: canceled ? config.wobbly : config.stiff });
    };
    const close = (velocity = 0) => {
        set({ y: height, config: { ...config.stiff, velocity } });
        closeBottomSheet();
    };

    useEffect(() => {
        if (isBottomSheetVisible) {
            open({ canceled: true });
        }
    }, []);

    const bind = useDrag(
        ({ first, last, vxvy: [, vy], movement: [, my], cancel, canceled }) => {
            if (first) draggingRef.current = true;
            // if this is not the first or last frame, it's a moving frame
            // then it means the user is dragging
            else if (last) setTimeout(() => (draggingRef.current = false), 0);

            // if the user drags up passed a threshold, then we cancel
            // the drag so that the sheet resets to its open position
            if (my < -70) cancel();

            // when the user releases the sheet, we check whether it passed
            // the threshold for it to close, or if we reset it to its open positino
            if (last)
                my > height * 0.75 || vy > 0.5 ? close(vy) : open({ canceled });
            // when the user keeps dragging, we just move the sheet according to
            // the cursor position
            else set({ y: my, immediate: false, config: config.stiff });
        },
        {
            initial: () => [0, y.get()],
            filterTaps: true,
            bounds: { top: 0 },
            rubberband: true,
        }
    );

    const display = y.to((py) => (py < height ? "block" : "none"));

    const bgStyle = {
        transform: y.to(
            [0, height],
            ["translateY(-8%) scale(1.16)", "translateY(0px) scale(1)"]
        ),
        opacity: y.to([0, height], [0.6, 0], "clamp"),
        // touchAction: y.to(v => (v > 0 ? 'auto' : 'none'))
    };
    return (
        <ModalPortal selector="#bottomsheet">
            <a.div
                className={"backdrop"}
                onClick={() => close()}
                style={bgStyle}
            ></a.div>
            <a.div
                className={"sheet"}
                {...bind()}
                style={{
                    display,
                    bottom: `calc(-100vh + ${height - 100}px)`,
                    y,
                }}
            >
                <div className={"dragger_wrapper"}>
                    <div className={"dragger"}></div>
                </div>
                <div className={"sheet_wrapper"}>{children}</div>
            </a.div>
        </ModalPortal>
    );
}

export default class BottomSheet extends React.Component {
    componentDidUpdate() {
        if (this.props.isBottomSheetVisible) {
            document.body.style.overflow = "hidden";
            document.getElementById("bottomsheet").style.width = "100%";
        } else {
            document.body.style.overflow = "unset";
            document.getElementById("bottomsheet").style.width = "0px";
        }
    }

    render() {
        const { isBottomSheetVisible, closeBottomSheet } = this.props;
        if (isBottomSheetVisible) {
            return (
                <BottomSheetWrapper
                    isBottomSheetVisible={isBottomSheetVisible}
                    closeBottomSheet={() => closeBottomSheet()}
                >
                    {this.props.children}
                </BottomSheetWrapper>
            );
        } else return null;
    }
}
