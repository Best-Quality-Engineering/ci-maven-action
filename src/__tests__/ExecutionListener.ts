/* eslint-disable no-unused-vars */
import {ExecListeners} from "@actions/exec";

export default class ExecutionListener
    implements ExecListeners {

    debug(data: string): void {
    }

    errline(data: string): void {
    }

    stderr(data: Buffer): void {
    }

    stdline(data: string): void {
    }

    stdout(data: Buffer): void {
    }
}
