import { MobileNoService } from './mobile-no.service';

describe('MobileNoService', () => {
    it('should equal 088-888-8888 when input is 0888888888', () => {
        const mobile = '0888888888';

        const sv = new MobileNoService();
        const result = sv.getMobileNo(mobile);

        expect(result).toEqual('088-888-8888');
    });

    it('should equal empty string when input is undefined', () => {
        const mobile = undefined;

        const sv = new MobileNoService();
        const result = sv.getMobileNo(mobile);

        expect(result).toEqual('');
    });
});
