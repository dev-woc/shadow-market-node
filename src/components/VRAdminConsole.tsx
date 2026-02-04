import { useEffect, useRef, useState } from 'react';
import { X, Maximize2, VolumeX, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Import A-Frame (side effects)
import 'aframe';

interface VRAdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VRAdminConsole = ({ isOpen, onClose }: VRAdminConsoleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    // Dynamically create the A-Frame scene
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing scene
    container.innerHTML = '';

    // Create scene HTML
    const sceneHTML = `
      <a-scene
        embedded
        vr-mode-ui="enabled: true"
        renderer="antialias: true; colorManagement: true"
        style="width: 100%; height: 100%;"
      >
        <!-- Assets -->
        <a-assets>
          <a-mixin id="neon-text" text="color: #00FF00; font: monoid"></a-mixin>
        </a-assets>

        <!-- Environment: Dark cyber room -->
        <a-sky color="#0a0a0a"></a-sky>

        <!-- Floor grid -->
        <a-plane
          position="0 0 0"
          rotation="-90 0 0"
          width="50"
          height="50"
          material="color: #0a0a0a; transparent: true; opacity: 0.9"
        ></a-plane>

        <!-- Grid lines on floor -->
        <a-entity id="floor-grid" position="0 0.01 0">
          ${generateGridLines()}
        </a-entity>

        <!-- Main terminal console (center) -->
        <a-entity id="main-console" position="0 1.2 -3">
          <!-- Monitor frame -->
          <a-box
            position="0 0 0"
            width="2.5"
            height="1.5"
            depth="0.1"
            material="color: #1a1a1a; metalness: 0.8; roughness: 0.2"
          ></a-box>

          <!-- Screen -->
          <a-plane
            position="0 0 0.06"
            width="2.3"
            height="1.3"
            material="color: #0a0a0a; emissive: #001100; emissiveIntensity: 0.3"
          ></a-plane>

          <!-- Terminal text -->
          <a-text
            position="-1 0.4 0.07"
            value="SLIDE_NATION://ADMIN_CONSOLE"
            color="#00FF00"
            width="2"
            font="monoid"
          ></a-text>
          <a-text
            position="-1 0.2 0.07"
            value="> TWO_SUM VALIDATION: PASSED"
            color="#00FF00"
            width="1.8"
            opacity="0.8"
            font="monoid"
          ></a-text>
          <a-text
            position="-1 0 0.07"
            value="> BASED ACCESS: GRANTED"
            color="#00FF00"
            width="1.8"
            opacity="0.8"
            font="monoid"
          ></a-text>
          <a-text
            position="-1 -0.2 0.07"
            value="> WELCOME, OPERATOR."
            color="#00FF00"
            width="1.8"
            opacity="0.8"
            font="monoid"
          ></a-text>
          <a-text
            position="-1 -0.4 0.07"
            value="> TYPE 'help' FOR COMMANDS█"
            color="#00FF00"
            width="1.8"
            font="monoid"
            animation="property: opacity; from: 1; to: 0.3; dur: 500; dir: alternate; loop: true"
          ></a-text>

          <!-- Neon border glow -->
          <a-box
            position="0 0 0.04"
            width="2.4"
            height="1.4"
            depth="0.02"
            material="color: #00FF00; emissive: #00FF00; emissiveIntensity: 0.5; transparent: true; opacity: 0.3"
          ></a-box>
        </a-entity>

        <!-- Left floating screen - PATCH NOTES (Story element!) -->
        <a-entity id="left-screen" position="-3 1.5 -2" rotation="0 30 0">
          <a-box
            width="1.5"
            height="2"
            depth="0.05"
            material="color: #1a1a1a; metalness: 0.8"
          ></a-box>
          <a-plane
            position="0 0 0.03"
            width="1.4"
            height="1.9"
            material="color: #0a0a0a; emissive: #001100; emissiveIntensity: 0.2"
          ></a-plane>
          <a-text
            position="-0.6 0.8 0.04"
            value="DEV PATCH NOTES"
            color="#00FF00"
            width="1.2"
            font="monoid"
          ></a-text>
          <a-text position="-0.6 0.55 0.04" value="v3.7.2 CHANGELOG:" color="#00FF00" width="0.9" opacity="0.7" font="monoid"></a-text>
          <a-text position="-0.6 0.35 0.04" value="- Fixed cart overflow" color="#00FF00" width="0.85" opacity="0.6" font="monoid"></a-text>
          <a-text position="-0.6 0.18 0.04" value="- Updated permissions" color="#00FF00" width="0.85" opacity="0.6" font="monoid"></a-text>
          <a-text position="-0.6 0.01 0.04" value="- Refund Mode: WIP" color="#FF0055" width="0.85" opacity="1" font="monoid"
            animation="property: opacity; from: 1; to: 0.4; dur: 800; dir: alternate; loop: true"></a-text>
          <a-text position="-0.6 -0.16 0.04" value="- Security audit TBD" color="#00FF00" width="0.85" opacity="0.6" font="monoid"></a-text>
          <a-text position="-0.6 -0.4 0.04" value="[CLICK TO INVESTIGATE]" color="#FF0055" width="0.8" opacity="0.8" font="monoid" class="clickable"></a-text>
          <a-box
            position="0 0 0.02"
            width="1.45"
            height="1.95"
            depth="0.01"
            material="color: #00FF00; emissive: #00FF00; emissiveIntensity: 0.3; transparent: true; opacity: 0.2"
          ></a-box>
        </a-entity>

        <!-- Right floating screen - SHADOW MARKET INTEL -->
        <a-entity id="right-screen" position="3 1.5 -2" rotation="0 -30 0">
          <a-box
            width="1.5"
            height="2"
            depth="0.05"
            material="color: #1a1a1a; metalness: 0.8"
          ></a-box>
          <a-plane
            position="0 0 0.03"
            width="1.4"
            height="1.9"
            material="color: #0a0a0a; emissive: #110011; emissiveIntensity: 0.2"
          ></a-plane>
          <a-text
            position="-0.6 0.8 0.04"
            value="SHADOW_MARKET"
            color="#FF0055"
            width="1.2"
            font="monoid"
          ></a-text>
          <a-text
            position="-0.6 0.55 0.04"
            value="[ACCESS: LOCKED]"
            color="#FF0055"
            width="1"
            opacity="0.8"
            font="monoid"
          ></a-text>
          <a-text position="-0.6 0.3 0.04" value="REQUIREMENTS:" color="#00FF00" width="0.9" opacity="0.7" font="monoid"></a-text>
          <a-text position="-0.6 0.12 0.04" value="[x] Gatekeeper" color="#00FF00" width="0.85" opacity="0.8" font="monoid"></a-text>
          <a-text position="-0.6 -0.05 0.04" value="[ ] Money Glitch" color="#666666" width="0.85" opacity="0.5" font="monoid"></a-text>
          <a-text position="-0.6 -0.22 0.04" value="[ ] The Wash" color="#666666" width="0.85" opacity="0.5" font="monoid"></a-text>
          <a-text position="-0.6 -0.39 0.04" value="[ ] Bot Swarm" color="#666666" width="0.85" opacity="0.5" font="monoid"></a-text>
          <a-text position="-0.6 -0.56 0.04" value="[ ] Secret Knock" color="#666666" width="0.85" opacity="0.5" font="monoid"></a-text>
          <a-box
            position="0 0 0.02"
            width="1.45"
            height="1.95"
            depth="0.01"
            material="color: #FF0055; emissive: #FF0055; emissiveIntensity: 0.2; transparent: true; opacity: 0.15"
          ></a-box>
        </a-entity>

        <!-- Floating holographic elements -->
        ${generateHolographicElements()}

        <!-- Ceiling elements - exposed wiring aesthetic -->
        <a-entity id="ceiling" position="0 4 0">
          ${generateCeilingWires()}
        </a-entity>

        <!-- Ambient particles -->
        <a-entity
          particle-system="preset: dust; particleCount: 500; color: #00FF00, #003300; size: 0.02; maxAge: 4"
          position="0 2 -3"
        ></a-entity>

        <!-- Lighting -->
        <a-light type="ambient" color="#001100" intensity="0.3"></a-light>
        <a-light type="point" color="#00FF00" intensity="0.8" position="0 3 -3" distance="10"></a-light>
        <a-light type="point" color="#FF0055" intensity="0.3" position="-3 2 -2" distance="8"></a-light>
        <a-light type="point" color="#00FF00" intensity="0.5" position="3 2 -2" distance="8"></a-light>

        <!-- Camera with controls -->
        <a-entity id="rig" position="0 1.6 2">
          <a-camera
            look-controls="pointerLockEnabled: false"
            wasd-controls="enabled: true; acceleration: 30"
          >
            <a-cursor color="#00FF00" fuse="false" raycaster="objects: .clickable"></a-cursor>
          </a-camera>
        </a-entity>
      </a-scene>
    `;

    container.innerHTML = sceneHTML;

    // Cleanup on unmount
    return () => {
      container.innerHTML = '';
    };
  }, [isOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4 bg-black border border-primary rounded overflow-hidden neon-border"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/80 border-b border-primary/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="font-mono text-sm text-primary">VR://ADMIN_CONSOLE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                  WASD to move • Drag to look • VR headset supported
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-muted-foreground hover:text-primary"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-neon-red"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* A-Frame container */}
            <div
              ref={containerRef}
              className="w-full h-full pt-12"
              style={{ minHeight: '500px' }}
            />

            {/* Bottom hint */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-4 py-2 bg-black/80 border-t border-primary/50">
              <p className="text-xs text-center text-muted-foreground font-mono">
                Click and drag to look around • Use WASD keys to move • Press VR button for immersive mode
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to generate floor grid
function generateGridLines(): string {
  let lines = '';
  const gridSize = 25;
  const spacing = 2;

  for (let i = -gridSize; i <= gridSize; i += spacing) {
    lines += `<a-entity line="start: ${-gridSize} 0 ${i}; end: ${gridSize} 0 ${i}; color: #003300; opacity: 0.5"></a-entity>`;
    lines += `<a-entity line="start: ${i} 0 ${-gridSize}; end: ${i} 0 ${gridSize}; color: #003300; opacity: 0.5"></a-entity>`;
  }

  return lines;
}

function generateHolographicElements(): string {
  return `
    <!-- Floating data cube -->
    <a-entity position="0 2.5 -4">
      <a-box
        width="0.5"
        height="0.5"
        depth="0.5"
        material="color: #00FF00; transparent: true; opacity: 0.3; wireframe: true"
        animation="property: rotation; to: 0 360 360; dur: 10000; loop: true; easing: linear"
      ></a-box>
      <a-box
        width="0.3"
        height="0.3"
        depth="0.3"
        material="color: #00FF00; emissive: #00FF00; emissiveIntensity: 0.5; transparent: true; opacity: 0.5"
        animation="property: rotation; to: 360 0 360; dur: 8000; loop: true; easing: linear"
      ></a-box>
    </a-entity>

    <!-- Orbiting rings -->
    <a-entity position="0 2.5 -4">
      <a-torus
        radius="0.8"
        radius-tubular="0.01"
        material="color: #00FF00; transparent: true; opacity: 0.4"
        rotation="90 0 0"
        animation="property: rotation; to: 90 360 0; dur: 15000; loop: true; easing: linear"
      ></a-torus>
      <a-torus
        radius="1"
        radius-tubular="0.01"
        material="color: #FF0055; transparent: true; opacity: 0.3"
        rotation="45 0 45"
        animation="property: rotation; to: 45 360 45; dur: 20000; loop: true; easing: linear"
      ></a-torus>
    </a-entity>

    <!-- Floating particles/nodes -->
    <a-sphere position="-2 2 -3" radius="0.05" material="color: #00FF00; emissive: #00FF00; emissiveIntensity: 1"
      animation="property: position; to: -2 2.3 -3; dur: 2000; dir: alternate; loop: true; easing: easeInOutSine"></a-sphere>
    <a-sphere position="2 2.2 -3.5" radius="0.05" material="color: #00FF00; emissive: #00FF00; emissiveIntensity: 1"
      animation="property: position; to: 2 1.9 -3.5; dur: 2500; dir: alternate; loop: true; easing: easeInOutSine"></a-sphere>
    <a-sphere position="0 2.8 -2" radius="0.03" material="color: #FF0055; emissive: #FF0055; emissiveIntensity: 1"
      animation="property: position; to: 0.2 2.6 -2; dur: 1800; dir: alternate; loop: true; easing: easeInOutSine"></a-sphere>
  `;
}

function generateCeilingWires(): string {
  return `
    <!-- Exposed pipes/wires -->
    <a-cylinder position="-3 0 -5" radius="0.05" height="10" rotation="0 0 90" material="color: #1a1a1a; metalness: 0.9"></a-cylinder>
    <a-cylinder position="3 0 -5" radius="0.05" height="10" rotation="0 0 90" material="color: #1a1a1a; metalness: 0.9"></a-cylinder>
    <a-cylinder position="0 0 -8" radius="0.03" height="15" rotation="0 90 0" material="color: #333; metalness: 0.9"></a-cylinder>

    <!-- Neon tube lights -->
    <a-cylinder position="-2 -0.5 -3" radius="0.02" height="3" rotation="0 0 90"
      material="color: #00FF00; emissive: #00FF00; emissiveIntensity: 0.8"></a-cylinder>
    <a-cylinder position="2 -0.5 -3" radius="0.02" height="3" rotation="0 0 90"
      material="color: #00FF00; emissive: #00FF00; emissiveIntensity: 0.8"></a-cylinder>
  `;
}
