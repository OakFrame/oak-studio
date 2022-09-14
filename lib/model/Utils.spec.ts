import {expect} from 'chai';
import {replaceAll, slugify, combine, Modulo1} from "./Utils";

describe('Utils', () => {

    it('should replace all', () => {

        expect(replaceAll('a','a','b')).equal('b');
        expect(replaceAll('a','a','')).equal('');
        expect(replaceAll('ab-cd','cd','dc')).equal('ab-dc');
        expect(replaceAll('ab-cd-ab-cd','ab-cd','q')).equal('q-q');

    });

    it('should slugify extra seperator', () => {

        expect(slugify('a')).equal('a');
        expect(slugify('a---')).equal('a');
        expect(slugify('-a-')).equal('a');
        expect(slugify('------')).equal('');

    });

    it('should slugify non-word character', () => {

        expect(slugify('This -- is a #%&*# test ---')).equal('this-is-a-test');

    });

    it('should slugify accented character', () => {

        expect(slugify(`C'est déjà l'été.`)).equal('cest-deja-lete');
        expect(slugify(`Nín hǎo. Wǒ shì zhōng guó rén`)).equal('nin-hao-wo-shi-zhong-guo-ren');

    });

    it('should slugify cyrillic character', () => {

        expect(slugify(`Компьютер`)).equal('kompyuter');

    });

    it('should slugify numbers character', () => {

        expect(slugify(`buildings with 1000 windows`)).equal('buildings-with-1000-windows');
        expect(slugify(`1,000 reasons you are #1`)).equal('1000-reasons-you-are-1');

    });

    it('should combine generic objects', () => {

        const combined_object:any = combine([{a:1},{b:2},{c:3}]);

        expect(combined_object.a).equal(1);
        expect(combined_object.b).equal(2);
        expect(combined_object.c).equal(3);

    });



    it('fake modulo 1', () => {

        expect(Modulo1(0,0)).equal(0);
        expect(Modulo1(0,1)).equal(1);
        expect(Modulo1(1,1)).equal(0);
        expect(Modulo1(1,2)).equal(1);

        expect(Modulo1(-1, -1)).equal(0);
        expect(Modulo1(-1, 0)).equal(1);

    });

});
