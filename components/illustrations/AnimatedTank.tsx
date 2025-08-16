import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect, Text } from "react-native-svg";

type WaterTankProps = {
	waterLevel: number;
	lowLevel?: number; // Yellow warning line (default: 30%)
	lowLowLevel?: number; // Red danger line (default: 15%)
	width?: number;
	height?: number;
};
const AnimatedPath = Animated.createAnimatedComponent(Path);
export const AnimatedTank: React.FC<WaterTankProps> = ({
	waterLevel = 50,
	lowLevel = 30,
	lowLowLevel = 15,
	width = 155,
	height = 203,
	...props
}) => {
	// Validate props
	const validatedWaterLevel = Math.max(0, Math.min(100, waterLevel));
	const validatedLowLevel = Math.max(0, Math.min(100, lowLevel));
	const validatedLowLowLevel = Math.max(0, Math.min(100, lowLowLevel));

	// Animation refs
	const waveOffset = useRef(new Animated.Value(0)).current;
	const waveHeightAnim = useRef(new Animated.Value(1)).current;

	// Tank dimensions
	const tankTop = 39.7309;
	const tankBottom = 202.869;
	const tankHeight = tankBottom - tankTop;
	const tankCurveFactor = 8; // Matches the tank's bottom curve

	// Calculate positions
	const waterHeight = (validatedWaterLevel / 100) * tankHeight;
	const waterTop = tankBottom - waterHeight;
	const lowLineY = tankBottom - (validatedLowLevel / 100) * tankHeight;
	const lowLowLineY = tankBottom - (validatedLowLowLevel / 100) * tankHeight;

	// Enhanced wave parameters
	const baseWaveHeight = 8;
	const waveLength = 20;

	const waveAnimated = useMemo(() => {
		return Animated.add(
			Animated.multiply(waveOffset, Animated.multiply(waveHeightAnim, 1)),
			0
		);
	}, [waveOffset, waveHeightAnim]);

	// Start combined animations
	useEffect(() => {
		const waveAnimation = Animated.loop(
			Animated.timing(waveOffset, {
				toValue: 2 * Math.PI,
				duration: 1500,
				easing: Easing.linear,
				useNativeDriver: true,
			})
		);

		const heightAnimation = Animated.loop(
			Animated.sequence([
				Animated.timing(waveHeightAnim, {
					toValue: 1.3,
					duration: 1000,
					easing: Easing.ease,
					useNativeDriver: true,
				}),
				Animated.timing(waveHeightAnim, {
					toValue: 1,
					duration: 1000,
					easing: Easing.ease,
					useNativeDriver: true,
				}),
			])
		);

		waveAnimation.start();
		heightAnimation.start();

		return () => {
			waveAnimation.stop();
			heightAnimation.stop();
		};
	}, [waveOffset, waveHeightAnim]);

	// Generate curve matching tank bottom angle
	const generateTankCurvedLine = (yPosition: number) => {
		const startX = 3.612;
		const endX = 131.342;
		const midX = (startX + endX) / 2;
		// Curve matches tank bottom angle using tankCurveFactor
		return `M${startX} ${yPosition} Q${midX} ${
			yPosition + tankCurveFactor
		} ${endX} ${yPosition}`;
	};

	// Generate label position matching curve
	const getLabelPosition = (yPosition: number) => {
		const labelX = 141.342; // 20px left of startX (3.612)
		const midX = (3.612 + 131.342) / 2;
		// Calculate Y position accounting for curve
		const curveOffset =
			tankCurveFactor * (1 - Math.pow((midX - 3.612) / (midX - 3.612), 2));
		return { x: labelX, y: yPosition + curveOffset };
	};

	// Generate wave path
	const generateWavePath = (offset: number, heightMultiplier: number) => {
		const startX = 3.612;
		const endX = 131.342;
		const width = endX - startX;
		const segments = Math.ceil(width / waveLength);

		let path = `M${startX} ${waterTop + waterHeight}`;
		path += ` L${startX} ${
			waterTop +
			baseWaveHeight * heightMultiplier * (0.3 + 0.7 * Math.sin(offset))
		}`;

		for (let i = 1; i <= segments; i++) {
			const x = startX + (i * width) / segments;
			const waveFactor = Math.sin(offset + i * 0.8);
			const y =
				waterTop + baseWaveHeight * heightMultiplier * (0.3 + 0.7 * waveFactor);
			path += ` L${x} ${y}`;
		}

		path += ` L${endX} ${waterTop + waterHeight} Z`;
		return path;
	};

	// Get positions for all labels
	const highLabelPos = getLabelPosition(tankTop);
	const lowLabelPos = getLabelPosition(lowLineY);
	const lowLowLabelPos = getLabelPosition(lowLowLineY);

	return (
		<Svg
			width={width}
			height={height}
			viewBox='0 0 155 203'
			fill='none'
			{...props}>
			{/* Tank structure */}
			<Path
				d='M67.2718 19.4258C59.3282 19.4258 44.3058 18.434 44.3058 14.6764V9.1696C44.3058 5.41426 59.3282 4.42249 67.2718 4.42249C75.2137 4.42249 90.2344 5.41426 90.2344 9.1696V14.6764C90.2344 18.4317 75.2137 19.4258 67.2718 19.4258ZM67.2718 5.54727C52.7687 5.54727 45.183 7.90506 45.183 9.16736V14.6741C45.183 15.9387 52.7687 18.2965 67.2718 18.2965C81.7732 18.2965 89.3572 15.9387 89.3572 14.6741V9.16736C89.3572 7.90506 81.7714 5.54727 67.2718 5.54727Z'
				fill='black'
			/>
			<Path
				d='M67.2719 48.1454C36.5236 48.1454 3.84375 44.8815 3.84375 38.8315C3.84375 38.5204 4.04024 38.2679 4.28233 38.2679C4.52443 38.2679 4.72092 38.5204 4.72092 38.8315C4.72092 42.1766 26.9958 47.0183 67.2719 47.0183C107.546 47.0183 129.821 42.1788 129.821 38.8315C129.821 38.5204 130.018 38.2679 130.26 38.2679C130.502 38.2679 130.698 38.5204 130.698 38.8315C130.698 44.8815 98.0184 48.1454 67.2719 48.1454Z'
				fill='black'
			/>

			{/* Clip path for water */}
			<Defs>
				<ClipPath id='water-clip'>
					<Path d='M3.61218 39.7309V184.954C3.61218 196.589 36.5183 202.869 67.4789 202.869C98.4394 202.869 131.344 196.589 131.342 184.951V39.7309C131.342 39.6385 131.333 39.5483 131.314 39.4626C131.33 39.2553 131.342 39.0434 131.342 38.8315C131.342 27.6579 115.407 17.9517 90.6712 9.16748V14.007C90.6712 4.11379 71.1788 3.85681 67.2701 3.85681C63.3614 3.85681 43.8655 4.11153 43.8655 9.16748V14.0769C19.3854 18.0599 3.61218 27.739 3.61218 38.8315C3.61218 39.0253 3.6227 39.2169 3.64025 39.4513C3.62095 39.5415 3.61218 39.6362 3.61218 39.7309Z' />
				</ClipPath>
			</Defs>

			{/* Water fill with enhanced animation */}
			<G clipPath='url(#water-clip)'>
				<Rect
					x='3.612'
					y={waterTop}
					width='127.73'
					height={waterHeight}
					fill='#007AFF'
					fillOpacity={0.4}
				/>

				<AnimatedPath
					fill='#4DA6FF'
					fillOpacity={0.9}
					d={waveAnimated.interpolate({
						inputRange: [0, 1, 2, 3],
						outputRange: [
							generateWavePath(0, 1),
							generateWavePath(2 * Math.PI, 1),
							generateWavePath(0, 1.3),
							generateWavePath(2 * Math.PI, 1.3),
						],
						extrapolate: "clamp",
					})}
				/>
			</G>

			{/* Tank-curved indicator lines */}
			{/* Green line (H) */}
			<Path
				d={generateTankCurvedLine(tankTop)}
				stroke='#1EFC21'
				strokeWidth={4}
				strokeLinecap='round'
			/>
			<Text
				x={highLabelPos.x}
				y={highLabelPos.y}
				fill='#000000'
				fontSize='12'
				fontWeight='bold'
				textAnchor='start'>
				H
			</Text>

			{/* Yellow warning line (L) */}
			<Path
				d={generateTankCurvedLine(lowLineY)}
				stroke='#FFF706'
				strokeWidth={4}
				strokeLinecap='round'
			/>
			<Text
				x={lowLabelPos.x}
				y={lowLabelPos.y}
				fill='#000000'
				fontSize='12'
				fontWeight='bold'
				textAnchor='start'>
				L
			</Text>

			{/* Red danger line (LL) */}
			<Path
				d={generateTankCurvedLine(lowLowLineY)}
				stroke='#FF171A'
				strokeWidth={4}
				strokeLinecap='round'
			/>
			<Text
				x={lowLowLabelPos.x}
				y={lowLowLabelPos.y}
				fill='#000000'
				fontSize='12'
				fontWeight='bold'
				textAnchor='start'>
				LL
			</Text>

			{/* Rest of the tank SVG */}
			<Path
				d='M67.2718 13.9191C59.3282 13.9191 44.3058 12.9273 44.3058 9.16743C44.3058 5.4121 59.3282 4.42029 67.2718 4.42029C75.2137 4.42029 90.2344 5.4121 90.2344 9.16743C90.2344 12.9273 75.2137 13.9191 67.2718 13.9191ZM67.2718 5.54734C52.7687 5.54734 45.183 7.90514 45.183 9.16743C45.183 10.432 52.7687 12.792 67.2718 12.792C81.7732 12.792 89.3572 10.432 89.3572 9.16743C89.3572 7.90514 81.7714 5.54734 67.2718 5.54734Z'
				fill='black'
			/>
			<Path
				d='M67.4789 202.869C36.5183 202.869 3.61218 196.589 3.61218 184.954V167.505C1.3754 165.14 0.242093 162.543 0.242093 159.78C0.242093 156.962 1.3754 154.332 3.61218 151.958V142.435C1.57188 140.345 0.540334 138.048 0.540334 135.598C0.540334 133.046 1.57364 130.709 3.61218 128.639V120.516C1.42627 118.78 0.361389 116.783 0.361389 114.418C0.361389 112.038 1.42452 110.032 3.61218 108.301V96.0226C0.161396 93.7279 0.161397 91.3881 0.161397 90.2385C0.161397 87.9258 1.29294 86.0256 3.61218 84.45V72.111C0.289462 70.283 0 68.3737 0 66.7125C0 63.8249 1.92451 62.2584 3.61218 61.3139V39.7309C3.61218 39.6362 3.62095 39.5415 3.64025 39.4513C3.6227 39.2169 3.61218 39.0253 3.61218 38.8315C3.61218 27.739 19.3854 18.0599 43.8655 14.0769V9.16748C43.8655 4.11153 63.3614 3.85681 67.2701 3.85681C71.1788 3.85681 90.6712 4.11379 90.6712 9.16748V14.007C115.407 17.9517 131.342 27.6579 131.342 38.8315C131.342 39.0434 131.33 39.2553 131.314 39.4626C131.333 39.5483 131.342 39.6385 131.342 39.7309V61.5641C133.491 62.9008 134.538 64.5913 134.538 66.7125C134.538 68.2926 134.281 70.1094 131.342 71.8676V84.7318C133.382 86.2488 134.375 88.0543 134.375 90.2385C134.375 91.9742 133.995 93.8338 131.342 95.7408V108.675C133.223 110.318 134.175 112.25 134.175 114.418C134.175 116.636 133.247 118.523 131.342 120.171V129.106C133.102 131.072 133.995 133.251 133.995 135.598C133.995 137.922 133.103 140.097 131.342 142.067V152.413C133.302 154.665 134.295 157.14 134.295 159.778C134.295 162.341 133.302 164.775 131.342 167.02V184.951C131.344 196.589 98.4394 202.869 67.4789 202.869ZM5.36652 39.9833V62.069C5.36652 62.5334 5.14722 62.9481 4.81039 63.1172C2.10169 64.4877 1.75434 65.759 1.75434 66.7125C1.75434 67.587 1.75433 68.7817 4.80688 70.301C5.14372 70.4701 5.36652 70.8871 5.36652 71.3514V85.142C5.36652 85.5748 5.17354 85.9715 4.86829 86.1586C2.22099 87.7929 1.91398 89.2693 1.91398 90.2385C1.91398 91.0906 1.91398 92.5197 4.86303 94.305C5.17003 94.492 5.36652 94.8888 5.36652 95.3238V108.945C5.36652 109.351 5.19634 109.728 4.92091 109.926C3.03325 111.296 2.11573 112.766 2.11573 114.418C2.11573 115.462 2.40695 117.06 4.92091 118.893C5.19634 119.093 5.36477 119.467 5.36477 119.873V129.198C5.36477 129.557 5.23144 129.895 5.00688 130.107C3.17886 131.836 2.29117 133.632 2.29117 135.6C2.29117 137.437 3.20693 139.247 5.01214 140.981C5.23319 141.193 5.36477 141.528 5.36477 141.882V152.499C5.36477 152.846 5.2402 153.175 5.02793 153.389C3.0157 155.405 1.99468 157.555 1.99468 159.78C1.99468 161.948 3.01395 164.065 5.02618 166.073C5.24021 166.287 5.36477 166.617 5.36477 166.964V184.954C5.36477 192.361 30.8728 200.615 67.4771 200.615C104.08 200.615 129.588 192.361 129.588 184.954V166.506C129.588 166.175 129.702 165.857 129.9 165.643C131.651 163.752 132.539 161.777 132.539 159.778C132.539 157.699 131.651 155.684 129.898 153.788C129.7 153.574 129.586 153.259 129.586 152.927V141.542C129.586 141.204 129.705 140.881 129.911 140.667C131.477 139.031 132.239 137.374 132.239 135.596C132.239 133.799 131.477 132.133 129.912 130.506C129.707 130.292 129.586 129.969 129.586 129.629V119.553C129.586 119.161 129.744 118.798 130.004 118.593C132.146 116.9 132.419 115.469 132.419 114.414C132.419 112.904 131.628 111.538 130 110.239C129.742 110.034 129.586 109.671 129.586 109.281V95.0578C129.586 94.634 129.77 94.2463 130.065 94.0547C132.621 92.3822 132.621 91.0883 132.621 90.2318C132.621 89.3211 132.356 87.9326 130.058 86.3908C129.768 86.1969 129.586 85.8115 129.586 85.3922V71.126C129.586 70.6707 129.798 70.2604 130.125 70.0869C132.782 68.66 132.782 67.578 132.782 66.7057C132.782 65.883 132.505 64.6342 130.118 63.3178C129.795 63.1397 129.586 62.7317 129.586 62.2831V40.0712C129.54 39.9202 129.521 39.7579 129.535 39.5979C129.563 39.2868 129.586 39.0569 129.586 38.827C129.586 28.9067 113.551 19.7821 89.6888 16.1191C89.2485 16.0515 88.9151 15.5714 88.9151 14.9989V9.31624C87.9327 7.97956 79.8312 6.10414 67.2684 6.10414C54.702 6.10414 46.6005 7.97956 45.6181 9.31624V15.0665C45.6181 15.6368 45.2882 16.1169 44.8479 16.1845C21.2328 19.8857 5.36477 28.9833 5.36477 38.8247C5.36477 39.0388 5.38406 39.2485 5.40161 39.4604C5.4174 39.6317 5.40511 39.8143 5.36652 39.9833Z'
				fill='black'
			/>
			<Path
				d='M74.4822 9.50103C73.998 9.50103 73.605 8.99612 73.605 8.37398V2.58319C73.605 2.40061 73.491 2.2541 73.3489 2.2541H60.03C59.8896 2.2541 59.7756 2.40061 59.7756 2.58319V8.37398C59.7756 8.99612 59.3826 9.50103 58.8984 9.50103C58.4142 9.50103 58.0212 8.99612 58.0212 8.37398V2.58319C58.0212 1.1586 58.923 0 60.03 0H73.3489C74.4576 0 75.3594 1.1586 75.3594 2.58319V8.37398C75.3594 8.99612 74.9664 9.50103 74.4822 9.50103Z'
				fill='black'
			/>
		</Svg>
	);
};
