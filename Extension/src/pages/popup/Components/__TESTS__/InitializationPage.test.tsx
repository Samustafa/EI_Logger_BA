import {test} from 'vitest'
import {render} from '@testing-library/react';
import {InitializationPage} from "@pages/popup/Components/InitializationPage";

test('expect to render', () => {
    render(<InitializationPage/>)
})