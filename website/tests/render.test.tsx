import { renderToString } from "react-dom/server";
import { dreamy } from "styled-system/jsx";

const LENGTH = 500;

function DreamyRender() {
    const time = timing();
    const html = renderToString(
        fromArray((index) => <dreamy.div key={index}>div {index}</dreamy.div>)
    );
    const end = time();
    console.log(`Dreamy render time: ${end}ms`);
    logHTML(html);
    return end;
}

// function StyledRender() {
// 	const time = timing();
// 	const html = renderToString(
// 		fromArray((index) => <styled.div key={index}>div {index}</styled.div>)
// 	);
// 	const end = time();
// 	console.log(`Styled render time: ${end}ms`);
// 	logHTML(html);
// 	return end;
// }

function ReactRender() {
    const time = timing();
    const html = renderToString(fromArray((index) => <div key={index}>div {index}</div>));
    const end = time();
    console.log(`React render time: ${end}ms`);
    logHTML(html);
    return end;
}

const times: number[][] = [[], []];

for (let i = 0; i < 50; i++) {
    const dreamyTime = DreamyRender();
    const reactTime = ReactRender();
    if (i > 2) {
        times[0].push(dreamyTime);
        times[1].push(reactTime);
    }

    console.log("--------------------------------");
}

const averageTimes = times
    .map((time) => time.reduce((a, b) => a + b, 0) / time.length)
    .map((time) => time.toFixed(2));
console.log(
    "Average times:",
    averageTimes.map((time, index) => `[${index === 0 ? "Dreamy" : "React"}]: ${time}ms`)
);

function timing() {
    const startTime = performance.now();
    return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        return Number(duration.toFixed(2));
    };
}

function fromArray(node: (index: number) => React.ReactNode): React.ReactNode[] {
    return Array.from({ length: LENGTH }).map((_, index) => node(index));
}

function logHTML(html: string) {
    if (LENGTH > 10) return;
    console.log(html);
}
