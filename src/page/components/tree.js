import { useEffect, useRef } from "react"

function Tree(){
    return <div className="tree">
		<div className="star">
			<div className="star-in"></div>
		</div>
		<div className="leaf-box">
			<div className="leaf">
				<div className="edge"></div>
				<div className="edge right"></div>
			</div>
			<div className="leaf">
				<div className="edge"></div>
				<div className="edge right"></div>
			</div>
			<div className="leaf">
				<div className="edge"></div>
				<div className="edge right"></div>
			</div>
			<div className="leaf">
				<div className="edge"></div>
				<div className="edge right"></div>
			</div>
			<div className="leaf">
				<div className="edge"></div>
				<div className="edge right"></div>
			</div>
		</div>

		<div className="trunk"></div>

		<div className="ball-box">
			<div className="ball b1"></div>
			<div className="ball b2"></div>
			<div className="ball b3"></div>
			<div className="ball b4"></div>
			<div className="ball b5"></div>
			<div className="ball b6"></div>
			<div className="ball b7"></div>
			<div className="ball b8"></div>
			<div className="ball b9"></div>
		</div>

		<div className="sparkle">
			<span>✦</span>
			<span>✦</span>
			<span>✦</span>
			<span>✦</span>
			<span>✦</span>
			<span>✦</span>
		</div>
		<div className="blink">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
}

function Snow(){
    const { clientWidth: width, clientHeight: height } = document.documentElement
    let snows = Array.from(new Array(1000)).map(val=>{
        let num = 4 * Math.random()
        
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            w: num,
            h: num,
            step: Math.random() * 2.5
        }
    })
    const canvas = useRef()

    useEffect(() => {
        if(canvas){
            const ctx = canvas.current.getContext('2d')
            canvas.current.width = width
            canvas.current.height = height
            ctx.fillStyle = '#ffffff'
            var render = ()=>{
                ctx.clearRect(0, 0, width, height)
                ctx.beginPath()
                snows.forEach(v=>{
                    v.y = v.y > height ? 0 : (v.y + v.step)
                    ctx.rect(v.x, v.y, v.w, v.h)
                })
                ctx.fill()
                // ctx.closePath();
                requestAnimationFrame(render)
            }
            render(ctx, width, height, snows)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvas, snows])

    return <canvas id="snowBg" ref={canvas} style={{backgroundColor: "rgba(0, 0, 0, 0)"}}></canvas>
}


export {
    Tree, Snow
}