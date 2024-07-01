declare module 'mineflayer' {
    interface Bot {
        viewer: ViewerAPI
    }
}

import { Vec3 } from 'vec3'
import { EventEmitter } from 'node:events'

interface ViewerAPIEvents {
    blockClicked(block, face, button): this
}

export class ViewerAPI extends EventEmitter<ViewerAPIEvents> {
    erase: (id: string) => void
    drawBoxGrid: (id: string, start: any, end: any, color = 'aqua') => void
    drawLine: (id: string, points: any, color = 0xff0000) => void
    drawPoints: (id: string, points: any, color = 0xff0000, size = 5) => void
    close: () => void
}

/**
 * Serve a webserver allowing to visualize
 * the bot surrounding, in first or third person.
 * Comes with drawing functionnalities.
 */
export function mineflayer(bot: import('mineflayer').Bot, settings: {
    /**
     * view radius, in chunks
     * @default 6
     */
    viewDistance?: number;
    /**
     * is the view first person?
     * @default false
     */
    firstPerson?: boolean;
    /**
     * the port for the webserver
     * @default 3000
     */
    port?: number;
    prefix?: string;
    _app?: import('express').Express;
    _http?: import('http').Server<typeof import('http').IncomingMessage, typeof import('http').ServerResponse>;
});

/**
 * Serve a webserver allowing to visualize a world.
 */
export function standalone(options: {
    /**
     * the version to use
     * @default 1.13.2
     */
    version: versions;
    /**
     * a world generator function
     * @default (x, y, z) => 0
     */
    world: (x: number, y: number, z: number) => 0 | 1;
    /**
     * a vec3 to center the view on
     * @default new Vec3(0, 0, 0)
     */
    center?: Vec3;
    /**
     * view radius, in chunks
     * @default 6
     */
    viewDistance?: number;
    /**
     * the port for the webserver
     * @default 3000
     */
    port?: number;
    prefix?: string;
});

/**
 * Render the bot view and stream it to a file or over TCP.
 */
export function headless(bot: import('mineflayer').Bot, settings: {
    viewDistance?: number;
    output?: string;
    frames?: number;
    width?: number;
    height?: number;
    logFFMPEG?: boolean;
    jpegOption: any;
});

/**
 * The core rendering library.
 * It provides `Viewer` and `WorldView` which
 * together make it possible to render a minecraft world.
 */
export const viewer: {
    Viewer: import('./lib/viewer').Viewer;
    WorldView: import('./lib/worldView').WorldView;
    MapControls: import('./lib/controls').MapControls;
    Entitiy: import('./lib/entity/Entity');
    getBufferFromStream: (stream: any) => Promise<Buffer>;
};

export const supportedVersions: versions[];
export type versions = '1.8.8' | '1.9.4' | '1.10.2' | '1.11.2' | '1.12.2' | '1.13.2' | '1.14.4' | '1.15.2' | '1.16.1' | '1.16.4' | '1.17.1' | '1.18.1';
