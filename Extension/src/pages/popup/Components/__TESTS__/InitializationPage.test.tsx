import {describe, expect, test} from "vitest";
import {cleanup, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {IdDisplayPage} from "@pages/popup/Components/Authenticated/IdDisplayPage";

describe('LandingPage', () => {
    beforeEach(() => {
        cleanup();
    })

    test('It renders', () => {
        render(<IdDisplayPage/>);
        screen.debug();
        expect(1).toEqual(1);
    });
})