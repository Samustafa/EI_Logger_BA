import {test} from 'vitest'
import {render} from '@testing-library/react';
import React from "react";
// import {DemographicsButton} from "@pages/popup/Components/SharedComponents/DemographicsButton";
import {UploadPage} from "@pages/popup/Components/Authenticated/UploadPage";
// import {DemographicsButton} from "@pages/popup/Components/SharedComponents/DemographicsButton";

test('expect to render', () => {
    // render(<DemographicsButton/>)
})

test('expect to render Page', () => {
    render(<UploadPage/>)
})
